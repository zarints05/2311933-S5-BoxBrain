// View, edit and delete one box at /boxes/:boxId.
import { ArrowLeftOutlined, CheckOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { Alert, App as AntApp, Button, Card, Col, DatePicker, Descriptions, Flex, Form, Input, InputNumber, Popconfirm, Result, Row, Spin, Tag, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { apiService } from "../../services/api"
import type { Box } from "../../types/box"
import {
  contentLines,
  contentsRules,
  dateRules,
  disableFutureDates,
  isForgotten,
  labelRules,
  locationRules,
  notesRules,
  numberRules,
  toBoxInput,
  toFormValues,
  today,
  type BoxFormValues,
} from "../../utils/boxForm"

export function BoxDetailsPage() {
  const { boxId } = useParams<{ boxId: string }>()
  const navigate = useNavigate()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm<BoxFormValues>()

  const [box, setBox] = useState<Box | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setBox(await apiService.getBox(boxId ?? ""))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load box")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [boxId])

  const handleSave = async (values: BoxFormValues) => {
    if (!box) return
    try {
      setBox(await apiService.updateBox(box.id, toBoxInput(values)))
      setIsEditing(false)
      message.success("Box updated")
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save changes")
    }
  }

  const markOpened = async () => {
    if (!box) return
    try {
      setBox(await apiService.updateBox(box.id, { last_opened_on: today() }))
      message.success("Marked as opened today")
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to update box")
    }
  }

  const handleDelete = async () => {
    if (!box) return
    try {
      await apiService.deleteBox(box.id)
      message.success("Box deleted")
      navigate("/")
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to delete box")
    }
  }

  if (loading) return <Spin style={{ display: "block", marginTop: 64 }} />

  if (!box) {
    return (
      <Result
        status="404"
        title="Box not found"
        subTitle={error}
        extra={<Button type="primary" onClick={() => navigate("/")}>Back to my boxes</Button>}
      />
    )
  }

  const lines = contentLines(box.contents)

  return (
    <>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} style={{ marginBottom: 12 }}>
        My boxes
      </Button>
      {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

      {isEditing ? (
        <Card title={`Edit box ${box.number}`}>
          <Form form={form} layout="vertical" initialValues={toFormValues(box)} onFinish={handleSave}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item name="number" label="Box number" rules={numberRules}>
                  <InputNumber min={1} max={99999} prefix="BOX" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item name="label" label="Label" rules={labelRules}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="location" label="Location" rules={locationRules}>
              <Input />
            </Form.Item>
            <Form.Item name="contents" label="Contents (one item per line)" rules={contentsRules}>
              <Input.TextArea rows={6} />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={16}>
                <Form.Item name="notes" label="Notes" rules={notesRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="last_opened_on" label="Last opened" rules={dateRules}>
                  <DatePicker format="YYYY-MM-DD" disabledDate={disableFutureDates} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Flex gap={8}>
              <Button type="primary" htmlType="submit">Save changes</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Flex>
          </Form>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Card>
              <Flex justify="space-between" align="flex-start" wrap gap={8}>
                <div>
                  <Typography.Text type="secondary" style={{ letterSpacing: 1 }}>
                    BOX
                  </Typography.Text>
                  <Typography.Title style={{ margin: 0, lineHeight: 1 }}>{box.number}</Typography.Title>
                </div>
                {isForgotten(box) && <Tag color="gold">Not opened for 12+ months</Tag>}
              </Flex>
              <Typography.Title level={3} style={{ marginTop: 12 }}>
                {box.label}
              </Typography.Title>
              <Typography.Paragraph type="secondary">
                <EnvironmentOutlined /> {box.location}
              </Typography.Paragraph>

              <Typography.Text strong>Inside ({lines.length})</Typography.Text>
              <Flex wrap gap={6} style={{ marginTop: 8 }}>
                {lines.length ? lines.map((line, i) => (
                  <Tag key={i} style={{ fontSize: 14, padding: "2px 10px", marginInlineEnd: 0 }}>
                    {line}
                  </Tag>
                )) : <Typography.Text type="secondary">This box is empty.</Typography.Text>}
              </Flex>

              <Flex gap={8} wrap style={{ marginTop: 24 }}>
                <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit</Button>
                <Button icon={<CheckOutlined />} onClick={markOpened} disabled={box.last_opened_on === today()}>
                  Opened today
                </Button>
                <Popconfirm title={`Delete box ${box.number}?`} okText="Delete" okButtonProps={{ danger: true }} onConfirm={handleDelete}>
                  <Button danger icon={<DeleteOutlined />}>Delete</Button>
                </Popconfirm>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="Details" size="small">
              <Descriptions
                column={1}
                size="small"
                items={[
                  { key: "opened", label: "Last opened", children: box.last_opened_on },
                  { key: "notes", label: "Notes", children: box.notes || "—" },
                  { key: "created", label: "Created", children: new Date(box.created_at).toLocaleString() },
                  { key: "updated", label: "Updated", children: new Date(box.updated_at).toLocaleString() },
                ]}
              />
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}
