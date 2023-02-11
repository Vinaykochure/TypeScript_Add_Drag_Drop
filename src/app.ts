//project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
//project state management
type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();
//add validort
//interface
interface Validator {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}

function validate(validatableInput: Validator) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  return isValid;
}
// autobind decorater
function autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const orignalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = orignalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
//project list class
class ProjectList {
  templateEl: HTMLTemplateElement;
  hostingEl: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateEl = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.hostingEl = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];

    const importNode = document.importNode(this.templateEl.content, true);

    this.element = importNode.firstElementChild as HTMLElement;

    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: Project[]) => {
      const releventProject = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = releventProject;
      this.renderProjects();
    });

    this.attach();
    this.rendorContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    //To avoid the dublication adding in project
    listEl.innerHTML = '';

    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private rendorContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJETCS';
  }

  private attach() {
    this.hostingEl.insertAdjacentElement('beforeend', this.element);
  }
}

//project input class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostingEl: HTMLDivElement;
  element: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostingEl = document.getElementById('app')! as HTMLDivElement;

    const importNode = document.importNode(this.templateEl.content, true);

    this.element = importNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

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
    this.attached();
  }

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

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  private attached() {
    this.hostingEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const projctInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finisheProjectList = new ProjectList('finished');
