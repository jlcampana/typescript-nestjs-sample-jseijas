/**
 * Container manager module
 */
import * as inversify from 'inversify';

/**
 * Class for a Container Manager.
 * This is a manager of inversify containers, so the same application can use
 * different containers for having different implementations of interfaces.
 */
class ContainerManager {

  private static defaultName: string = 'default';

  private containers: Map<string, inversify.interfaces.Container> = new Map<string, inversify.interfaces.Container>();

  /**
   * Constructor of the class.
   */
  constructor() {
    this.containers[ContainerManager.defaultName] = new inversify.Container();
  }

  /**
   * Indicates if the container exists or not.
   * @param name Name of the container.
   * @returns True if the container exists, false otherwise.
   */
  public existsContainer(name: string): boolean {
    return this.containers[name] !== undefined;
  }

  /**
   * Returns a container given its name. If the container does not exists then
   * create it before returning.
   * @param name Name of the container.
   * @returns A container for the given container name.
   */
  public getContainer(name?: string): inversify.interfaces.Container {
    if (!name) {
      return this.containers[ContainerManager.defaultName];
    }
    if (!this.existsContainer(name)) {
      this.containers[name] = new inversify.Container();
    }
    return this.containers[name];
  }

  /**
   * Removes a container given its name.
   * @param name Name of the container.
   */
  public removeContainer(name: string): void {
    delete this.containers[name];
  }
}

/**
 * Exports a singleton implementing the container manager.
 */
export const containerManager: ContainerManager = new ContainerManager();
