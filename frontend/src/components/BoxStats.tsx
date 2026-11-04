// Three summary cards: boxes, items stored and boxes not opened for 12 months.
import { AppstoreOutlined, FieldTimeOutlined, InboxOutlined } from "@ant-design/icons"
import { Card, Col, Row, Statistic } from "antd"
import type { Box } from "../types/box"
import { contentLines, isForgotten } from "../utils/boxForm"

type Props = {
  boxes: Box[]
}

export function BoxStats({ boxes }: Props) {
  // Derived during render, so no extra state is needed.
  const itemCount = boxes.reduce((sum, b) => sum + contentLines(b.contents).length, 0)
  const forgottenCount = boxes.filter(isForgotten).length

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic title="Boxes" value={boxes.length} prefix={<InboxOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic title="Items stored" value={itemCount} prefix={<AppstoreOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card size="small">
          <Statistic
            title="Not opened for 12+ months"
            value={forgottenCount}
            prefix={<FieldTimeOutlined />}
            styles={{ content: { color: forgottenCount ? "#d48806" : undefined } }}
          />
        </Card>
      </Col>
    </Row>
  )
}
