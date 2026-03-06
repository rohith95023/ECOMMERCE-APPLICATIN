from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from ...db.database import get_database
from ...schemas.schemas import ProductCreate, ProductResponse
from ..deps import check_owner_role
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=List[ProductResponse])
async def list_products(category_id: Optional[str] = None, include_hidden: bool = False, db=Depends(get_database)):
    query: dict = {} if include_hidden else {"is_available": True}
    if category_id:
        query["category_id"] = category_id
    
    products = await db.products.find(query).to_list(100)
    for prod in products:
        prod["_id"] = str(prod["_id"])
    return products

@router.post("", response_model=ProductResponse)
async def create_product(product: ProductCreate, db=Depends(get_database), current_user=Depends(check_owner_role)):
    prod_dict = product.dict()
    prod_dict["created_at"] = datetime.utcnow()
    prod_dict["updated_at"] = datetime.utcnow()
    
    result = await db.products.insert_one(prod_dict)
    prod_dict["_id"] = str(result.inserted_id)
    return prod_dict

@router.put("/{prod_id}", response_model=ProductResponse)
async def update_product(prod_id: str, product: ProductCreate, db=Depends(get_database), current_user=Depends(check_owner_role)):
    update_data = product.dict()
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.products.update_one({"_id": ObjectId(prod_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    prod = await db.products.find_one({"_id": ObjectId(prod_id)})
    prod["_id"] = str(prod["_id"])
    return prod

@router.delete("/{prod_id}")
async def delete_product(prod_id: str, db=Depends(get_database), current_user=Depends(check_owner_role)):
    result = await db.products.delete_one({"_id": ObjectId(prod_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
