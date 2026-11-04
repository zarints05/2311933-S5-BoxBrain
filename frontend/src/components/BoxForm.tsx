// Add-box form (shown in a modal); passes the validated values up to the page through onAdd.
import { PlusOutlined } from "@ant-design/icons"
import { Button, DatePicker, Flex, Form, Input, InputNumber } from "antd"
import dayjs from "dayjs"
import type { BoxInput } from "../types/box"
import {
  contentsRules,
  dateRules,
  disableFutureDates,
  labelRules,
  locationRules,
  notesRules,
  numberRules,
  toBoxInput,
  type BoxFormValues,
} from "../utils/boxForm"

type Props = {
  nextNumber: number
  onAdd: (data: BoxInput) => Promise<boolean>
}

export function BoxForm({ nextNumber, onAdd }: Props) {
  const [form] = Form.useForm<BoxFormValues>()

  const handleFinish = async (values: BoxFormValues) => {
    // On success the page remounts this form (new key), which clears it.
    await onAdd(toBoxInput(values))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ number: nextNumber, last_opened_on: dayjs() }}
      onFinish={handleFinish}
    >
      <Flex gap={12} style={{ marginTop: 8 }}>
        <Form.Item name="number" rules={numberRules} style={{ marginBottom: 12, width: 140 }}>
          <InputNumber min={1} max={99999} prefix="BOX" aria-label="Box number" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="label" rules={labelRules} style={{ marginBottom: 12, flex: 1 }}>
          <Input placeholder="Label, e.g. Winter clothes" aria-label="Box label" />
        </Form.Item>
      </Flex>
      <Form.Item name="location" rules={locationRules} style={{ marginBottom: 12 }}>
        <Input placeholder="Where is it? e.g. Storage room, top shelf" aria-label="Location" />
      </Form.Item>
      <Form.Item name="contents" rules={contentsRules} style={{ marginBottom: 12 }}>
        <Input.TextArea rows={4} placeholder={"Contents, one item per line\n3 sweaters\nJacket\nScarf"} aria-label="Contents" />
      </Form.Item>
      <Form.Item name="notes" rules={notesRules} style={{ marginBottom: 12 }}>
        <Input placeholder="Notes (optional)" aria-label="Notes" />
      </Form.Item>
      <Form.Item name="last_opened_on" label="Last opened" rules={dateRules} style={{ marginBottom: 12 }}>
        <DatePicker format="YYYY-MM-DD" disabledDate={disableFutureDates} style={{ width: "100%" }} />
      </Form.Item>
      <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block size="large">
        Save box
      </Button>
    </Form>
  )
}
