import {
  ClassTransformOptions,
  instanceToInstance,
  Transform,
  TransformationType,
  TransformFnParams,
} from 'class-transformer'

// New decorator to be used on members that should not be transformed.
export function Ignore () {
  // reuse transform decorator
  return Transform((params: TransformFnParams) => {
    console.log('start of transform')
    console.log(params)
    if (params.type === TransformationType.CLASS_TO_CLASS) {
      // class-transformer won't touch functions,
      // so we use function-objects as container to skip transformation.
      const container = () => params.value
      container.type = '__skipTransformContainer__'

      return container
    }
    // On other transformations just return the value.
    return params.value
  })
}

// Extended classToPlain to unwrap the container objects
export function customInstanceToInstance<T> (object: T, options?: ClassTransformOptions) {
  const result = instanceToInstance(object, options)
  unwrapSkipTransformContainers(result)
  return result
}

// Recursive function to iterate over all keys of an object and its nested objects.
function unwrapSkipTransformContainers (obj: any) {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      const currentValue = obj[i]
      if (currentValue?.type === '__skipTransformContainer__') {
        // retrieve the original value and also set it.
        obj[i] = currentValue()
        continue
      }

      // recursion + recursion anchor
      if (typeof currentValue === 'object') {
        unwrapSkipTransformContainers(currentValue)
      }
    }
  }
}
