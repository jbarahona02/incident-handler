export interface ErrorState {
  show: boolean;
  errors: {[key: string]: any} | null;
}