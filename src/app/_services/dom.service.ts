
import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef
} from '@angular/core';
/*
PURPOSE OF THIS SERVICE IS TO DYNA MICALLY ADD COMPENTS TO THE DOM ITSELF WITHOUT USING ROUTES
*/

@Injectable()
export class DomService {
  
  // one private property used to reference the child compnent,
  private childComponentRef:any;

  // we use 3 services from angular "componentFactoryResolver", "applictionRef", and "injtory"
  //injetor is the injection toke, and the componet resov les 
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  /*
    this service has 2 public methods, "appendComponentTo" & "removeComponent"
    this service has 1 private method at the bottom "remove" used to remove from the dom

    (1) Append to componet: the args, parentId, wihc will be the "popupContainer on trace table"
    (2) child: this contains the input and outputs from the child "detailCompent in this case"
    
  */

  public appendComponentTo(parentId: string, child: any, childConfig?: childConfig) {
    // Create a component reference from the component 
    const childComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    // Attach the config to the child (inputs and outputs)
    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(childComponentRef.hostView);

    // Get DOM element from component
    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    document.getElementById(parentId).appendChild(childDomElem);

  }
  
  /*used to remove the dcompnent from the dom. Destrying the active modal componet */
  public removeComponent() {
    this.appRef.detachView(this.childComponentRef.hostView);
    this.childComponentRef.destroy();
  }


  private attachConfig(config, componentRef){
    let inputs = config.inputs;
    let outputs = config.outputs;
    for(var key in inputs){
      componentRef.instance[key] = inputs[key];
    }
    for(var key in outputs){
      componentRef.instance[key] = outputs[key];
    }
    
  }
}

// this is use for the config in the pop component in src/components/trace/deatils
interface childConfig{
  inputs:object,
  outputs:object
}