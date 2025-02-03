/**
 * A generic interface for a language module.
 */
export interface ILanguageModule {
  /**
   * Register language-specific components into a container.
   *
   * @param container - A dependency injection container that exposes type-safe methods.
   */
  register(container: Container): void;
}

/**
 * A simple container interface for dependency registration.
 * You can expand this interface as needed.
 */
export interface Container {
  use<T>(component: T): void;
  register<T>(name: string, component: T): void;
}
