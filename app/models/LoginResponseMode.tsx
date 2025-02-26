export interface LogoinResponseModel{
    success: string
    error: string
    cc: string
}

export interface CC{
id: number;
  type: string;
  name: string;
  categories: any[];  // Adjust type if you have specific data structure
  consumption_occasions: any[]; // Adjust type if needed
}