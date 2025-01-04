import { Injectable, signal } from '@angular/core'
import { IsActiveMatchOptions } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class FuseUtilsService {
  isLoading = signal(false)
  activeRequests = 0
  /**
   * Constructor
   */
  constructor() {}

  showLoading() {
    this.isLoading.update(() => true)
  }

  hideLoading() {
    setTimeout(() => {
      this.isLoading.update(() => false)
    }, 500)
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get the equivalent "IsActiveMatchOptions" options for "exact = true".
   */
  get exactMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'exact',
    }
  }

  /**
   * Get the equivalent "IsActiveMatchOptions" options for "exact = false".
   */
  get subsetMatchOptions(): IsActiveMatchOptions {
    return {
      paths: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
      queryParams: 'subset',
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Generates a random id
   *
   * @param length
   */
  randomId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let name = ''

    for (let i = 0; i < 10; i++) {
      name += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return name
  }
}
