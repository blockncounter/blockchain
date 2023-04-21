/**
 * Validation class
 */
export default class Validation {
  success: boolean;
  message: string;

  /**
   * Constructor for Validation class
   * @param success If the validation was successful
   * @param message The validation message if the validation was not successful
   */
  constructor(success: boolean = true, message: string = '') {
    this.success = success;
    this.message = message;
  }
}
