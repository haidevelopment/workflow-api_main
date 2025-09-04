# Workflow API (Express + TypeScript + MongoDB)

API server dùng Express + TypeScript + Mongoose, xác thực bằng Clerk. Cung cấp các thực thể chính: `Workflow`, `WorkflowExecution`, `ExecutionPhase`, `ExecutionLog`, `UserBalance` tương ứng với schema Prisma của app Next.js.

## 1) Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)

## 2) Cài đặt
```bash
cd /Users/leducngochai24/Documents/Workspace/workflow-api
npm install
```

## 3) Cấu hình .env
Tạo file `.env` tại thư mục gốc `workflow-api`:
```bash
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/workflow

# Nếu dùng Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```
Lưu ý: `.gitignore` đã bỏ qua `.env`.

## 4) Chạy server
- Dev:
```bash
npm run dev
```
- Build + Start:
```bash
npm run build
npm start
```
- Health check (không yêu cầu auth):
```bash
GET http://localhost:4000/health
```

## 5) Xác thực (Clerk)
Tất cả route dưới `/api/**` yêu cầu Bearer token của Clerk.
- Cách lấy token nhanh: từ app Next.js đã tích hợp Clerk sau khi đăng nhập, hoặc dùng SDK Clerk để lấy `session token`.
- Trong Postman: Authorization → Bearer Token → dán token.

### Test nhanh khi chưa có token (tuỳ chọn, chỉ dùng dev)
Bạn có thể tạm thời bỏ qua auth để test Postman:
1. Mở file `src/routes/index.ts`
2. Comment dòng sau:
```ts
router.use(clerkRequireAuth, attachUser);
```
3. Thêm middleware tạm để gán `userId` giả:
```ts
router.use((req, _res, next) => { (req as any).userId = 'test-user'; next(); });
```
4. Restart server và test bình thường (không cần Bearer token). Sau khi test xong hãy bật lại auth.

## 6) Endpoints
- Workflows
  - `GET /api/workflows` — danh sách workflows của user
  - `POST /api/workflows` — tạo workflow mới
  - `GET /api/workflows/:id` — chi tiết workflow
  - `PUT /api/workflows/:id` — cập nhật
  - `DELETE /api/workflows/:id` — xoá

- Executions / Phases / Logs
  - `POST /api/workflows/:id/executions` — tạo execution cho workflow `:id`
  - `GET /api/executions/:id` — lấy execution + danh sách phases
  - `POST /api/executions/:id/phases` — thêm phase cho execution `:id`
  - `POST /api/phases/:id/logs` — thêm log cho phase `:id`

- User balance
  - `GET /api/user/balance` — lấy credits
  - `POST /api/user/balance/adjust` — điều chỉnh credits `{ delta: number }`

## 7) Ví dụ cURL
- GET tất cả workflows
```bash
curl -X GET http://localhost:4000/api/workflows \
  -H "Authorization: Bearer <CLERK_JWT>"
```

- Tạo workflow
```bash
curl -X POST http://localhost:4000/api/workflows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{
    "name":"My Workflow",
    "description":"Demo",
    "definition":"{}",
    "executionPlan":"{}",
    "creditsCost":2,
    "cron":"0 0 * * *",
    "status":"DRAFT"
  }'
```

- Tạo execution cho workflow
```bash
curl -X POST http://localhost:4000/api/workflows/<WORKFLOW_ID>/executions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{"strigger":"manual","status":"PENDING","definition":"{}"}'
```

- Thêm phase cho execution
```bash
curl -X POST http://localhost:4000/api/executions/<EXEC_ID>/phases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{
    "number":1,
    "node":"task_1",
    "name":"Phase 1",
    "status":"RUNNING",
    "inputs":"{}",
    "outputs":"{}",
    "creditsConsumed":1
  }'
```

- Thêm log cho phase
```bash
curl -X POST http://localhost:4000/api/phases/<PHASE_ID>/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{"logLevel":"INFO","message":"Started phase"}'
```

- Balance
```bash
curl -X GET http://localhost:4000/api/user/balance \
  -H "Authorization: Bearer <CLERK_JWT>"

curl -X POST http://localhost:4000/api/user/balance/adjust \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{"delta":10}'
```

## 8) Ghi chú dữ liệu
- `Workflow`: unique index `(name, userId)`
- `WorkflowExecution`: thuộc `workflowId`, lưu trạng thái/definition/thời gian
- `ExecutionPhase`: unique `(workflowExecutionId, number)`; có `inputs/outputs`, `creditsConsumed`
- `ExecutionLog`: thuộc `executionPhaseId`
- `UserBalance`: credits theo `userId`

## 9) Scripts
- `npm run dev`: chạy dev (ts-node-dev)
- `npm run build`: compile TypeScript → `dist/`
- `npm start`: chạy bản build
