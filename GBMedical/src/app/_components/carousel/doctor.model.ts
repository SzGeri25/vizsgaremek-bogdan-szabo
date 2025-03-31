export interface Doctor {
    id: number;
    name: string;
    bio: string;
    phoneNumber: string;
    email: string;
  }
  
  export interface DoctorsResponse {
    result: Doctor[];
    status: string;
    statusCode: number;
  }