namespace App {
  //Component Base class
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    templateEl: HTMLTemplateElement;
    hostingEl: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateEl = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostingEl = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(this.templateEl.content, true);
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
      this.hostingEl.insertAdjacentElement(
        insertAtBeginning ? 'afterbegin' : 'beforeend',
        this.element
      );
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }
}
