// Box page (/boxes/<id>): everything about one box, with Edit, "Opened today" and Delete.
// The strip on top uses the box's own colour, the same as its card on the home page.

import { CheckOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { App as AntApp, Button, Popconfirm, Result, Spin } from "antd"
import { useEffect, useState, type CSSProperties } from "react"
import { useNavigate, useParams } from "react-router"
import { changeBox, deleteBox, fetchBox } from "../api"
import BoxForm from "../components/BoxForm"
import { boxColour, boxToFormValues, itemsInside, notOpenedForAYear, todayString } from "../helpers"
import type { Box, BoxInput } from "../types"

export default function BoxPage() {
  const { id } = useParams() // the id from the URL
  const navigate = useNavigate()
  const { message } = AntApp.useApp()

  const [box, setBox] = useState<Box | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundReason, setNotFoundReason] = useState("")
  const [editing, setEditing] = useState(false)

  // Load the box when the page opens (and again if the id in the URL changes)
  useEffect(() => {
    fetchBox(id ?? "")
      .then((data) => setBox(data))
      .catch((error) => setNotFoundReason(error.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave(input: BoxInput) {
    if (!box) return
    try {
      setBox(await changeBox(box.id, input))
      setEditing(false)
      message.success("Box updated")
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  async function handleMarkOpened() {
    if (!box) return
    try {
      setBox(await changeBox(box.id, { last_opened_on: todayString() }))
      message.success("Marked as opened today")
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  async function handleDelete() {
    if (!box) return
    try {
      await deleteBox(box.id)
      message.success("Box deleted")
      navigate("/")
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  if (loading) {
    return <Spin style={{ display: "block", marginTop: 64 }} />
  }

  if (!box) {
    return (
      <Result
        status="404"
        title="Box not found"
        subTitle={notFoundReason}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to my boxes
          </Button>
        }
      />
    )
  }

  const items = itemsInside(box)
  const colour = { "--box": boxColour(box) } as CSSProperties

  return (
    <div style={colour}>
      <button className="back-link" onClick={() => navigate("/")}>
        ← My boxes
      </button>

      {editing ? (
        <div className="panel">
          <h3>Edit box {box.number}</h3>
          <BoxForm
            startValues={boxToFormValues(box)}
            saveText="Save changes"
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="box-page">
          {/* Left: the box itself */}
          <div>
            <div className="box-hero">
              <span className="box-word">BOX</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="box-number">{box.number}</span>
                {notOpenedForAYear(box) && <span className="old-badge">Not opened for 12+ months</span>}
              </div>
              <h1>{box.label}</h1>
              <div className="box-hero-place">
                <EnvironmentOutlined /> {box.location}
              </div>
            </div>

            <div className="panel">
              <h3>Inside ({items.length})</h3>
              <div className="chips">
                {items.length === 0 && <span className="empty-text">This box is empty.</span>}
                {items.map((item, index) => (
                  <span key={index} className="chip">
                    {item}
                  </span>
                ))}
              </div>

              <div className="panel-buttons">
                <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button icon={<CheckOutlined />} onClick={handleMarkOpened} disabled={box.last_opened_on === todayString()}>
                  Opened today
                </Button>
                <Popconfirm
                  title={`Delete box ${box.number}?`}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                  onConfirm={handleDelete}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>

          {/* Right: dates and notes */}
          <div className="panel">
            <h3>Details</h3>
            <dl className="facts">
              <dt>Last opened</dt>
              <dd>{box.last_opened_on}</dd>
              <dt>Notes</dt>
              <dd>{box.notes || "—"}</dd>
              <dt>Created</dt>
              <dd>{new Date(box.created_at).toLocaleString()}</dd>
              <dt>Updated</dt>
              <dd>{new Date(box.updated_at).toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
