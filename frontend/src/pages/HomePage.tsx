// Home page: the title and search, the number tiles, and a card for every box.

import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { Alert, App as AntApp, Modal, Skeleton } from "antd"
import { useEffect, useState } from "react"
import { addBox, changeBox, deleteBox, fetchBoxes } from "../api"
import BoxCard from "../components/BoxCard"
import BoxForm from "../components/BoxForm"
import Summary from "../components/Summary"
import { newBoxFormValues, notOpenedForAYear, todayString } from "../helpers"
import type { Box, BoxInput } from "../types"

export default function HomePage() {
  const { message } = AntApp.useApp() // the small pop-up messages at the top

  const [boxes, setBoxes] = useState<Box[]>([])
  const [totalBoxes, setTotalBoxes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [searchText, setSearchText] = useState("")
  const [onlyOldBoxes, setOnlyOldBoxes] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Get the boxes from the backend
  async function loadBoxes() {
    try {
      const page = await fetchBoxes()
      setBoxes(page.items)
      setTotalBoxes(page.total)
      setLoadError("")
    } catch (error) {
      setLoadError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Load them once, when the page opens
  useEffect(() => {
    loadBoxes()
  }, [])

  async function handleAdd(input: BoxInput) {
    try {
      await addBox(input)
      setShowAddForm(false)
      message.success(`Box ${input.number} added`)
      loadBoxes()
    } catch (error) {
      message.error((error as Error).message) // e.g. "Box number 17 is already used"
    }
  }

  async function handleMarkOpened(box: Box) {
    try {
      await changeBox(box.id, { last_opened_on: todayString() })
      message.success(`Box ${box.number} marked as opened today`)
      loadBoxes()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  async function handleDelete(box: Box) {
    try {
      await deleteBox(box.id)
      message.success("Box deleted")
      loadBoxes()
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  // The next free box number, so the add form can suggest it
  let biggestNumber = 0
  for (const box of boxes) {
    if (box.number > biggestNumber) biggestNumber = box.number
  }

  // "Where is my ...?" looks at the label, the location and everything inside
  const search = searchText.trim().toLowerCase()
  const shownBoxes = boxes.filter((box) => {
    const text = `${box.label} ${box.location} ${box.contents}`.toLowerCase()
    if (search && !text.includes(search)) return false
    if (onlyOldBoxes && !notOpenedForAYear(box)) return false
    return true
  })

  return (
    <>
      {/* The title, the add button and the search */}
      <section className="hero">
        <div className="hero-top">
          <div>
            <h1>My boxes</h1>
            <p>Everything in your boxes, suitcases and drawers, and where you put them.</p>
          </div>
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            <PlusOutlined /> Add box
          </button>
        </div>

        <div className="hero-search">
          <SearchOutlined className="search-icon" />
          <input
            placeholder="Where is my…? e.g. passport"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search boxes"
          />
          {searchText && (
            <button className="clear-search" onClick={() => setSearchText("")}>
              Clear
            </button>
          )}
        </div>
      </section>

      {loadError && <Alert type="error" title={loadError} showIcon style={{ marginTop: 16 }} />}

      <Summary boxes={boxes} />

      <div className="filter-row">
        <div className="filter-pills">
          <button className={onlyOldBoxes ? "pill" : "pill active"} onClick={() => setOnlyOldBoxes(false)}>
            All boxes
          </button>
          <button className={onlyOldBoxes ? "pill active" : "pill"} onClick={() => setOnlyOldBoxes(true)}>
            Not opened for 12 months
          </button>
        </div>
        <span className="count">
          Showing {shownBoxes.length} of {totalBoxes}
        </span>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : shownBoxes.length === 0 ? (
        <div className="empty-state">
          {search ? `No box contains "${searchText}".` : "No boxes yet. Add your first one!"}
        </div>
      ) : (
        <div className="box-grid">
          {shownBoxes.map((box) => (
            <BoxCard key={box.id} box={box} searchText={searchText} onMarkOpened={handleMarkOpened} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {totalBoxes > boxes.length && <p className="count" style={{ textAlign: "center" }}>Showing the first {boxes.length} boxes.</p>}

      {/* destroyOnHidden: the form is thrown away when the window closes, so it starts empty next time */}
      <Modal title="Add a box" open={showAddForm} onCancel={() => setShowAddForm(false)} footer={null} destroyOnHidden>
        <BoxForm startValues={newBoxFormValues(biggestNumber + 1)} saveText="Save box" onSave={handleAdd} />
      </Modal>
    </>
  )
}
