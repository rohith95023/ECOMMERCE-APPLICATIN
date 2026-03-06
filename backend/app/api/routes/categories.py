from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ...db.database import get_database
from ...schemas.schemas import CategoryCreate, CategoryResponse
from ..deps import check_owner_role
from bson import ObjectId

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("", response_model=List[CategoryResponse])
async def list_categories(db=Depends(get_database)):
    categories = await db.categories.find({"is_active": True}).to_list(100)
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    return categories

@router.post("", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db=Depends(get_database), current_user=Depends(check_owner_role)):
    cat_dict = category.dict()
    cat_dict["is_active"] = True
    result = await db.categories.insert_one(cat_dict)
    cat_dict["_id"] = str(result.inserted_id)
    return cat_dict

@router.put("/{cat_id}", response_model=CategoryResponse)
async def update_category(cat_id: str, category: CategoryCreate, db=Depends(get_database), current_user=Depends(check_owner_role)):
    update_data = category.dict()
    result = await db.categories.update_one({"_id": ObjectId(cat_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    cat = await db.categories.find_one({"_id": ObjectId(cat_id)})
    cat["_id"] = str(cat["_id"])
    return cat

@router.delete("/{cat_id}")
async def delete_category(cat_id: str, db=Depends(get_database), current_user=Depends(check_owner_role)):
    result = await db.categories.update_one({"_id": ObjectId(cat_id)}, {"$set": {"is_active": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category soft-deleted"}
