// The form for a box. The home page uses it to add a box,
// and the box page uses the same form to edit one.

import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Space } from "antd"
import { formValuesToInput, isAfterToday, type BoxFormValues } from "../helpers"
import type { BoxInput } from "../types"

type BoxFormProps = {
  startValues: Partial<BoxFormValues>
  saveText: string // text on the save button
  onSave: (input: BoxInput) => void
  onCancel?: () => void // only the edit form has a Cancel button
}

export default function BoxForm({ startValues, saveText, onSave, onCancel }: BoxFormProps) {
  return (
    <Form
      layout="vertical"
      initialValues={startValues}
      // onFinish only runs when every rule below passes
      onFinish={(values: BoxFormValues) => onSave(formValuesToInput(values))}
      style={{ marginTop: 8 }}
    >
      <Row gutter={12}>
        <Col xs={24} sm={8}>
          <Form.Item name="number" label="Box number" rules={[{ required: true, message: "Give the box a number" }]}>
            <InputNumber min={1} max={99999} prefix="BOX" aria-label="Box number" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16}>
          <Form.Item
            name="label"
            label="Label"
            rules={[
              { required: true, whitespace: true, message: "Give the box a label" },
              { max: 200, message: "Keep the label under 200 characters" },
            ]}
          >
            <Input placeholder="e.g. Winter clothes" aria-label="Box label" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="location"
        label="Where is it?"
        rules={[
          { required: true, whitespace: true, message: "Write where the box is kept" },
          { max: 200, message: "Keep the location under 200 characters" },
        ]}
      >
        <Input placeholder="e.g. Storage room, top shelf" aria-label="Location" />
      </Form.Item>

      <Form.Item
        name="contents"
        label="What's inside? (one item per line)"
        rules={[{ max: 2000, message: "That's too long (2000 characters at most)" }]}
      >
        <Input.TextArea rows={5} placeholder={"3 sweaters\nJacket\nScarf"} aria-label="Contents" />
      </Form.Item>

      <Row gutter={12}>
        <Col xs={24} sm={14}>
          <Form.Item name="notes" label="Notes" rules={[{ max: 1000, message: "Keep notes under 1000 characters" }]}>
            <Input placeholder="Optional" aria-label="Notes" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={10}>
          <Form.Item name="last_opened_on" label="Last opened" rules={[{ required: true, message: "Pick a date" }]}>
            <DatePicker format="YYYY-MM-DD" disabledDate={isAfterToday} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Space>
        <Button type="primary" htmlType="submit" size="large">
          {saveText}
        </Button>
        {onCancel && (
          <Button size="large" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Space>
    </Form>
  )
}
