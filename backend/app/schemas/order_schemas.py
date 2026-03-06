from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    BEING_PACKED = "being_packed"
    PACKED = "packed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    subtotal: float

class OrderBase(BaseModel):
    notes: Optional[str] = None
    pickup_time: Optional[datetime] = None

class OrderCreate(OrderBase):
    items: List[OrderItem]

class OrderResponse(OrderBase):
    id: str = Field(..., alias="_id")
    order_number: str
    customer_id: str
    items: List[OrderItem]
    subtotal: float
    tax_rate: float
    tax_amount: float
    grand_total: float
    status: OrderStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
