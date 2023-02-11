/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validators.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  //project input class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputEl = this.element.querySelector(
        '#title'
      )! as HTMLInputElement;
      this.descriptionInputEl = this.element.querySelector(
        '#description'
      )! as HTMLInputElement;
      this.peopleInputEl = this.element.querySelector(
        '#people'
      )! as HTMLInputElement;

      this.configure();
    }

    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}

    private getherInputIformation(): [string, string, number] | void {
      const enterTitle = this.titleInputEl.value;
      const enterDescription = this.descriptionInputEl.value;
      const enterPeople = this.peopleInputEl.value;

      const titleValidator: Validator = {
        value: enterTitle,
        required: true,
      };
      const descriptionValidator: Validator = {
        value: enterDescription,
        required: true,
        minLength: 4,
      };
      const peopleValidator: Validator = {
        value: +enterPeople, ///parsrFloat(enterPeople) conversion into number is must otherwise it could be fail to validate
        required: true,
        min: 1,
        max: 5,
      };

      if (
        !validate(titleValidator) ||
        !validate(descriptionValidator) ||
        !validate(peopleValidator)
      ) {
        alert('Invaild input!.Please fill all the inputs');
        return;
      } else {
        return [enterTitle, enterDescription, +enterPeople];
      }
    }

    private clearInputs() {
      this.titleInputEl.value =
        this.descriptionInputEl.value =
        this.peopleInputEl.value =
          '';
    }

    @autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.getherInputIformation();
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        // console.log(title, des, people);
        projectState.addProject(title, desc, people);
        this.clearInputs();
      }
    }
  }
}
