import { useState, useEffect } from "react";
import { Callout as RadixCallout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as styles from "./Callout.module.scss";

function Callout({ size = "3", children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <blockquote>
        {children}
      </blockquote>
    )
  }

  return (
    <RadixCallout.Root size={size} className={styles.container}>
      <RadixCallout.Icon>
        <InfoCircledIcon />
      </RadixCallout.Icon>
      <RadixCallout.Text className={styles.text}>
        {children}
      </RadixCallout.Text>
    </RadixCallout.Root>
  )
}

export default Callout;
