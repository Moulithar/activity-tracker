import * as React from "react";
import { Popover } from "@base-ui-components/react/popover";
import styles from "./index.module.css";

export default function ExamplePopover({ Trigger, children }) {
  return (
    <Popover.Root

    >
      <Popover.Trigger className={styles.IconButton}>{Trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className={styles.Popup}>{children}</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
