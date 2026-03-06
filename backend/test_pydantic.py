from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    email: str

class UserResponse(UserBase):
    id: str = Field(..., alias="_id")
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(populate_by_name=True)

def test_validate():
    data = {
        "full_name": "Test",
        "email": "test@test.com",
        "_id": "69aad48d55442e1a2834595e",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    try:
        user = UserResponse.model_validate(data)
        print("Validated successfully")
        print(user.model_dump())
        print(user.model_dump(by_alias=True))
    except Exception as e:
        print(f"Validation failed: {e}")

if __name__ == "__main__":
    test_validate()
