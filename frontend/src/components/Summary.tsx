// The three number tiles on the home page.

import { AppstoreOutlined, FieldTimeOutlined, InboxOutlined } from "@ant-design/icons"
import { itemsInside, notOpenedForAYear } from "../helpers"
import type { Box } from "../types"

export default function Summary({ boxes }: { boxes: Box[] }) {
  let itemCount = 0
  let oldBoxCount = 0
  for (const box of boxes) {
    itemCount += itemsInside(box).length
    if (notOpenedForAYear(box)) oldBoxCount += 1
  }

  return (
    <div className="tiles">
      <div className="tile orange">
        <span className="tile-icon">
          <InboxOutlined />
        </span>
        <span>
          <span className="tile-number">{boxes.length}</span>
          <span className="tile-label">Boxes</span>
        </span>
      </div>

      <div className="tile teal">
        <span className="tile-icon">
          <AppstoreOutlined />
        </span>
        <span>
          <span className="tile-number">{itemCount}</span>
          <span className="tile-label">Items stored</span>
        </span>
      </div>

      <div className="tile purple">
        <span className="tile-icon">
          <FieldTimeOutlined />
        </span>
        <span>
          <span className="tile-number">{oldBoxCount}</span>
          <span className="tile-label">Not opened for 12+ months</span>
        </span>
      </div>
    </div>
  )
}
