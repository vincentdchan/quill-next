import React from "react"
import { IRenderOptions } from "./hooks/use-react-blot"

function CustomImage(options: IRenderOptions) {
  return <div>image: <img src={options.value as string} /></div>
}

export default CustomImage;
