// One box on the home page. A thin strip on top shows the box's own colour.
// Clicking the card opens the box page. The three buttons at the bottom:
// "opened today", "view" and "delete".

import { CheckOutlined, DeleteOutlined, EnvironmentOutlined, EyeOutlined } from "@ant-design/icons"
import { Button, Popconfirm, Tooltip } from "antd"
import type { CSSProperties, MouseEvent } from "react"
import { useNavigate } from "react-router"
import { boxColour, itemsInside, notOpenedForAYear, todayString } from "../helpers"
import type { Box } from "../types"

type BoxCardProps = {
  box: Box
  searchText: string // what is typed in the search box (to highlight matching items)
  onMarkOpened: (box: Box) => void
  onDelete: (box: Box) => void
}

// The card itself is clickable, so a click on a button must not also open the card
function stopClick(event: MouseEvent) {
  event.stopPropagation()
}

export default function BoxCard({ box, searchText, onMarkOpened, onDelete }: BoxCardProps) {
  const navigate = useNavigate()
  const openBoxPage = () => navigate(`/boxes/${box.id}`)

  const items = itemsInside(box)
  const search = searchText.trim().toLowerCase()
  const matchingItems = search ? items.filter((item) => item.toLowerCase().includes(search)) : []

  // While searching, show the items that match. Otherwise show the first 5.
  const itemsToShow = matchingItems.length > 0 ? matchingItems : items.slice(0, 5)
  const hiddenCount = items.length - itemsToShow.length

  // styles.css uses --box for the strip on top of the card and the box number
  const colour = { "--box": boxColour(box) } as CSSProperties

  return (
    <div className="box-card" style={colour} onClick={openBoxPage}>
      <div className="box-card-top">
        <span className="box-word">BOX</span>
        <span className="box-number">{box.number}</span>
        {notOpenedForAYear(box) && <span className="old-badge">12+ months</span>}
      </div>

      <div className="box-card-body">
        <h3 className="box-label">{box.label}</h3>
        <p className="box-place">
          <EnvironmentOutlined /> {box.location}
        </p>

        <div className="chips">
          {itemsToShow.map((item, index) => (
            <span key={index} className={matchingItems.includes(item) ? "chip match" : "chip"}>
              {item}
            </span>
          ))}
          {matchingItems.length === 0 && hiddenCount > 0 && <span className="chip more">+{hiddenCount} more</span>}
          {items.length === 0 && <span className="empty-text">Empty</span>}
        </div>
      </div>

      <div className="box-card-actions" onClick={stopClick}>
        <span>
          <Tooltip title="Mark as opened today">
            <Button
              type="text"
              icon={<CheckOutlined />}
              aria-label="Opened today"
              disabled={box.last_opened_on === todayString()}
              onClick={() => onMarkOpened(box)}
            />
          </Tooltip>
        </span>
        <span>
          <Button type="text" icon={<EyeOutlined />} aria-label="View box" onClick={openBoxPage} />
        </span>
        <span>
          <Popconfirm
            title={`Delete box ${box.number}?`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(box)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete box" />
          </Popconfirm>
        </span>
      </div>
    </div>
  )
}
