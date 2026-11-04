// Static page that describes the project.
import { Typography } from "antd"

export function AboutPage() {
  return (
    <>
      <Typography.Title level={2}>About BoxBrain</Typography.Title>
      <Typography.Paragraph type="secondary">
        BoxBrain remembers what is inside your boxes and where they are, built as a FastAPI REST API with a React frontend. This MVP covers box create, list, view, update and delete, plus "where is my X?" search and boxes not opened for 12 months.
      </Typography.Paragraph>

      <Typography.Title level={4}>Tech stack</Typography.Title>
      <Typography.Paragraph type="secondary">
        React 19 · TypeScript · Vite · Ant Design · React Router · FastAPI · SQLModel · SQLite (local) / PostgreSQL (production)
      </Typography.Paragraph>

      <Typography.Title level={4}>Backend layers</Typography.Title>
      <Typography.Paragraph type="secondary">
        Router (routes) → Service (business rules) → Repository (database) → Model (table), with schemas for request and response shapes.
      </Typography.Paragraph>

      <Typography.Title level={4}>Built by</Typography.Title>
      <Typography.Paragraph type="secondary">Zarin Tasnim (2311933)</Typography.Paragraph>
    </>
  )
}
