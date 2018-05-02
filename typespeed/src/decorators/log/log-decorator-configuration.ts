/**
 * Class for the log decorator configuration manager.
 */
export class LogDecoratorConfiguration {
  private static defaultName: string = 'default';
  private configurations: any[] = [];

  /**
   * Constructor of the class.
   */
  constructor() {
    this.addConfigurations();
  }

  /**
   * Gets a configuration given its name. If no name is provided, return the
   * default configuration.
   * @param name Name of the configuration.
   */
  public getConfiguration(name?: string) : any {
    const configurationName: string = name ? name : LogDecoratorConfiguration.defaultName;
    return this.configurations[configurationName] || this.configurations[LogDecoratorConfiguration.defaultName];
  }

  /**
   * Sets a configuration given its name and value.
   * @param name Name of the configuration
   * @param configuration Object with the configuration information.
   */
  public setConfiguration(name: string, configuration: any): void {
    if (!name) {
      return;
    }
    this.configurations[name] = configuration;
  }

  /**
   * Removes a configuration given its name.
   * @param name Name of the configuration.
   */
  public removeConfiguration(name: string): void {
    if (!name) {
      return;
    }
    delete this.configurations[name];
  }

  /**
   * Adds the default configurations.
   */
  private addConfigurations(): void {
    this.setConfiguration('default', { includeTime: true, includeArgs: true, includeProperties: true });
    this.setConfiguration('trace', { includeTime: false, includeArgs: true, includeProperties: true });
  }
}
