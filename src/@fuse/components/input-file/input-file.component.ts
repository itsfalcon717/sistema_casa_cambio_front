import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  // styles: [':host{display:contents}'], // Makes component host as if it was not there, can offer less css headaches. Use @HostBinding class approach for easier overrides.
  standalone: true,
  imports: [CommonModule],
})
export class InputFileComponent {
  // @HostBinding('class') protected readonly class = 'contents'; // Makes component host as if it was not there, can offer less css headaches. Assumes .contents{display:contents} css class exits
  // constructor() {}

  file = {
    archivo: null,
    archivo64: null,
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => {
        return reject(error)
      }
    })
  }

  fileChangeEvent(e: any[]) {
    console.log(e)
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.file.archivo = input.files[0].name
      await this.getBase64(input.files[0]).then((data) => {
        this.file.archivo64 = data
      })
    } else {
      this.file.archivo = null
    }
  }
}
