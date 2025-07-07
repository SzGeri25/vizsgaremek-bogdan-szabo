export interface Doctor {
  id: number;
  name: string;
  bio: string;
  phoneNumber: string;
  email: string;
  imageUrl?: string;
}
  
  export interface DoctorsResponse {
    result: Doctor[];
    status: string;
    statusCode: number;
  }