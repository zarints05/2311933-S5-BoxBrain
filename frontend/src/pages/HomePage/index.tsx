// Box grid page: loads boxes from the API, owns the list state and passes it to the components below.
import { PlusOutlined } from "@ant-design/icons"
import { Alert, App as AntApp, Button, Flex, Input, Modal, Segmented, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { BoxForm } from "../../components/BoxForm"
import { BoxGrid } from "../../components/BoxGrid"
import { BoxStats } from "../../components/BoxStats"
import { PAGE_SIZE, apiService } from "../../services/api"
import type { Box, BoxInput } from "../../types/box"
import { isForgotten, today } from "../../utils/boxForm"

const messageOf = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong")

type View = "all" | "forgotten"

export function HomePage() {
  const navigate = useNavigate()
  const { message } = AntApp.useApp()

  // useState stores a value; calling its setter re-renders the page with the new value.
  const [boxes, setBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<View>("all")
  const [isAdding, setIsAdding] = useState(false)

  const hasMore = boxes.length < total
  // Suggest the next free number for the form.
  const nextNumber = boxes.reduce((max, b) => Math.max(max, b.number), 0) + 1

  // Reload as many rows as are already shown, so edits and deletes keep the list in place.
  const reload = async (shown: number) => {
    const size = Math.min(Math.max(shown, PAGE_SIZE), 100)
    const page = await apiService.getBoxes(0, size)
    setBoxes(page.items)
    setTotal(page.total)
  }

  // useEffect runs after render; the empty [] means only once, so boxes load when the page opens.
  useEffect(() => {
    const loadOnOpen = async () => {
      try {
        await reload(PAGE_SIZE)
      } catch (err) {
        setError(messageOf(err))
      } finally {
        setLoading(false)
      }
    }
    loadOnOpen()
  }, [])

  // Keep the browser tab title in sync with the number of boxes.
  useEffect(() => {
    document.title = boxes.length > 0 ? `(${boxes.length}) BoxBrain` : "BoxBrain"
  }, [boxes])

  // Runs a change, refreshes the list and reports the result; returns false on failure.
  const run = async (action: () => Promise<unknown>, success: string): Promise<boolean> => {
    try {
      await action()
      await reload(boxes.length + 1)
      message.success(success)
      return true
    } catch (err) {
      message.error(messageOf(err))
      return false
    }
  }

  const addBox = async (data: BoxInput) => {
    const ok = await run(() => apiService.createBox(data), `Box ${data.number} added`)
    if (ok) setIsAdding(false)
    return ok
  }

  const markOpened = (box: Box) =>
    run(() => apiService.updateBox(box.id, { last_opened_on: today() }), `Box ${box.number} marked as opened today`)

  const deleteBox = (id: string) => run(() => apiService.deleteBox(id), "Box deleted")

  const loadMore = async () => {
    try {
      const page = await apiService.getBoxes(boxes.length, PAGE_SIZE)
      setBoxes((prev) => [...prev, ...page.items])
      setTotal(page.total)
    } catch (err) {
      message.error(messageOf(err))
    }
  }

  // Derived value: "Where is my X?" searches the label, location and every item in each box.
  const query = search.trim().toLowerCase()
  const visibleBoxes = boxes.filter(
    (b) =>
      (!query || `${b.label}\n${b.location}\n${b.contents}`.toLowerCase().includes(query)) &&
      (view === "all" || isForgotten(b)),
  )

  return (
    <>
      <Flex justify="space-between" align="center" wrap gap={12} style={{ marginBottom: 4 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          My boxes
        </Typography.Title>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsAdding(true)}>
          Add box
        </Button>
      </Flex>
      <Typography.Paragraph type="secondary">
        Everything in your boxes, suitcases and drawers, and where you put them.
      </Typography.Paragraph>

      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

      <BoxStats boxes={boxes} />

      <Input.Search
        allowClear
        size="large"
        placeholder="Where is my…? e.g. passport"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search boxes"
        style={{ marginBottom: 12 }}
      />
      <Flex justify="space-between" align="center" wrap gap={8} style={{ marginBottom: 16 }}>
        <Segmented<View>
          value={view}
          onChange={setView}
          options={[
            { label: "All boxes", value: "all" },
            { label: "Not opened for 12 months", value: "forgotten" },
          ]}
        />
        <Typography.Text type="secondary">
          Showing {visibleBoxes.length} of {total}
        </Typography.Text>
      </Flex>

      <BoxGrid
        boxes={visibleBoxes}
        loading={loading}
        hasMore={hasMore}
        search={search}
        onOpened={markOpened}
        onDelete={deleteBox}
        onView={(id) => navigate(`/boxes/${id}`)}
        onLoadMore={loadMore}
      />

      <Modal title="Add a box" open={isAdding} onCancel={() => setIsAdding(false)} footer={null} destroyOnHidden>
        <BoxForm nextNumber={nextNumber} onAdd={addBox} />
      </Modal>
    </>
  )
}
