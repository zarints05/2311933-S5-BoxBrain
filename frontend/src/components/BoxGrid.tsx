// Shows each box as a card with its number, label, location and contents; actions go up through callbacks.
import { CheckOutlined, DeleteOutlined, EnvironmentOutlined, EyeOutlined } from "@ant-design/icons"
import { Button, Card, Col, Empty, Flex, Popconfirm, Row, Skeleton, Tag, Tooltip, Typography } from "antd"
import type { Box } from "../types/box"
import { contentLines, isForgotten, today } from "../utils/boxForm"

type Props = {
  boxes: Box[]
  loading: boolean
  hasMore: boolean
  search: string
  onOpened: (box: Box) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  onLoadMore: () => void
}

export function BoxGrid({ boxes, loading, hasMore, search, onOpened, onDelete, onView, onLoadMore }: Props) {
  const query = search.trim().toLowerCase()

  if (loading) return <Skeleton active paragraph={{ rows: 6 }} />

  if (boxes.length === 0) {
    return <Empty style={{ marginTop: 32 }} description={query ? `No box contains "${search}".` : "No boxes yet — add your first one."} />
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {boxes.map((box) => {
          const lines = contentLines(box.contents)
          const matches = query ? lines.filter((l) => l.toLowerCase().includes(query)) : []
          const shown = query && matches.length ? matches : lines.slice(0, 5)
          return (
            <Col key={box.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ height: "100%" }}
                onClick={() => onView(box.id)}
                actions={[
                  <Tooltip key="opened" title="Mark as opened today">
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      aria-label="Opened today"
                      disabled={box.last_opened_on === today()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpened(box)
                      }}
                    />
                  </Tooltip>,
                  <Button
                    key="view"
                    type="text"
                    icon={<EyeOutlined />}
                    aria-label="View box"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(box.id)
                    }}
                  />,
                  <span key="delete" onClick={(e) => e.stopPropagation()}>
                    <Popconfirm title={`Delete box ${box.number}?`} okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => onDelete(box.id)}>
                      <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete box" />
                    </Popconfirm>
                  </span>,
                ]}
              >
                <Flex justify="space-between" align="flex-start" gap={8}>
                  <Typography.Text type="secondary" style={{ fontSize: 12, letterSpacing: 1 }}>
                    BOX
                  </Typography.Text>
                  {isForgotten(box) && <Tag color="gold">12+ months</Tag>}
                </Flex>
                <Typography.Title level={2} style={{ margin: "0 0 4px", lineHeight: 1 }}>
                  {box.number}
                </Typography.Title>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {box.label}
                </Typography.Text>
                <div style={{ margin: "6px 0 10px" }}>
                  <Typography.Text type="secondary">
                    <EnvironmentOutlined /> {box.location}
                  </Typography.Text>
                </div>
                <Flex wrap gap={4}>
                  {shown.map((line, i) => (
                    <Tag key={i} color={matches.includes(line) ? "orange" : undefined} style={{ marginInlineEnd: 0 }}>
                      {line}
                    </Tag>
                  ))}
                  {!query && lines.length > shown.length && <Tag style={{ marginInlineEnd: 0 }}>+{lines.length - shown.length} more</Tag>}
                  {lines.length === 0 && <Typography.Text type="secondary">Empty</Typography.Text>}
                </Flex>
              </Card>
            </Col>
          )
        })}
      </Row>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button onClick={onLoadMore}>Load more boxes</Button>
        </div>
      )}
    </>
  )
}
