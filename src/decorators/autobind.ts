namespace App {
  // autobind decorater
  export function autobind(
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
}
