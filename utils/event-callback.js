import {useEffect, useMemo, useRef} from 'react'

const useEventCallback = (fn) => {
  let ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  return useMemo(
    () =>
      (...args) => {
        const {current} = ref
        return current(...args)
      },
    []
  )
}
export default useEventCallback
