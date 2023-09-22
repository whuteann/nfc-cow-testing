import { useFormikContext } from "formik"
import { useEffect } from "react"

export const getFieldErrorNames = (formikErrors:any) => {
  const transformObjectToDotNotation = (obj:any, prefix = '', result:any[] = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (!value) return

      const nextKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object') {
        transformObjectToDotNotation(value, nextKey, result)
      } else {
        result.push(nextKey)
      }
    })

    return result
  }

  return transformObjectToDotNotation(formikErrors)
}

export const ScrollToFieldError = ({
  scrollBehavior = { behavior: 'smooth', block: 'center' },
}:any):any => {
  const { submitCount, isValid, errors } = useFormikContext()

  useEffect(() => {
    if (isValid) return;
    const fieldErrorNames = getFieldErrorNames(errors)
    if (fieldErrorNames.length <= 0) return

    const element = document.querySelector(
      `div[id='${fieldErrorNames[0]}']`
    )

    if (!element) return
    
    // Scroll to first known error into view
    element.scrollIntoView(scrollBehavior)

  }, [submitCount])
  return null
}

