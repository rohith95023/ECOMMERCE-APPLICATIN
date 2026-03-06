from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ...db.database import get_database
from ...schemas.order_schemas import OrderCreate, OrderResponse, OrderStatus
from ..deps import get_current_active_user, check_owner_role
from ...core.websocket import manager
from bson import ObjectId
from datetime import datetime
import random
import string

router = APIRouter(prefix="/orders", tags=["orders"])

def generate_order_number():
    date_str = datetime.now().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ORD-{date_str}-{random_str}"

@router.post("/", response_model=OrderResponse)
async def place_order(order: OrderCreate, db=Depends(get_database), current_user=Depends(get_current_active_user)):
    order_dict = order.dict()
    
    # Calculate totals
    subtotal = sum(item["subtotal"] for item in order_dict["items"])
    tax_rate = 0.05  # 5% GST example
    tax_amount = subtotal * tax_rate
    grand_total = subtotal + tax_amount
    
    order_dict.update({
        "order_number": generate_order_number(),
        "customer_id": str(current_user["_id"]),
        "subtotal": subtotal,
        "tax_rate": tax_rate,
        "tax_amount": tax_amount,
        "grand_total": grand_total,
        "status": OrderStatus.PENDING,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await db.orders.insert_one(order_dict)
    order_dict["_id"] = str(result.inserted_id)
    
    # Notify Owner(s) via WebSocket
    await manager.broadcast({"type": "NEW_ORDER", "order": order_dict})
    
    return order_dict

@router.get("/my", response_model=List[OrderResponse])
async def list_my_orders(db=Depends(get_database), current_user=Depends(get_current_active_user)):
    orders = await db.orders.find({"customer_id": str(current_user["_id"])}).sort("created_at", -1).to_list(100)
    for ord in orders:
        ord["_id"] = str(ord["_id"])
    return orders

@router.get("/", response_model=List[OrderResponse])
async def list_all_orders(db=Depends(get_database), current_user=Depends(check_owner_role)):
    orders = await db.orders.find().sort("created_at", -1).to_list(100)
    for ord in orders:
        ord["_id"] = str(ord["_id"])
    return orders

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: str, status: OrderStatus, db=Depends(get_database), current_user=Depends(check_owner_role)):
    result = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    order["_id"] = str(order["_id"])
    
    # Notify Customer via WebSocket
    await manager.send_personal_message(
        {"type": "ORDER_STATUS_UPDATE", "order_id": order_id, "status": status},
        order["customer_id"]
    )
    
    return order
