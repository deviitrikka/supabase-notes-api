# 🗒️ Supabase Notes API

A secure and scalable REST API for managing personal notes using **Supabase Edge Functions** and **PostgreSQL**.

---

## 🧠 Why This Schema Design?

- **UUIDs**: Used for primary and foreign keys to ensure global uniqueness and enhanced security.  
- **TEXT columns**: Ideal for storing flexible note content with no size limit.  
- **Timestamps**: Automatically capture `created_at` and `updated_at` times for better tracking.  
- **Foreign key to `auth.users`**: Seamlessly ties notes to authenticated users, and allows cascading delete for automatic cleanup.

```sql
-- filepath: schema.sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

---

## 🧩 Edge Functions

These functions live under the `functions/` directory and are deployed using the Supabase CLI.

### ✅ POST `/notes`

Handles **note creation**.  
📝 **Why POST**: We're creating a new resource.  
📍 **Reads parameters from**: JSON body.

```bash
curl -X POST 'https://ohfwwmignbjlgqsnbobc.supabase.co/functions/v1/post-notes' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "01ee4784-2eee-4eab-aa25-cbd249d26efd",
    "title": "Sample Note",
    "content": "This is a test note created using a Supabase Edge Function."
  }'
```

📦 **Sample Response**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": "7eda2c3a-c044-47c2-8fe8-6c1d3d39089d",
    "user_id": "01ee4784-2eee-4eab-aa25-cbd249d26efd",
    "title": "Sample Note",
    "content": "This is a test note created using a Supabase Edge Function.",
    "created_at": "2025-04-28T04:07:26.892426+00:00",
    "updated_at": "2025-04-28T04:07:26.892426+00:00"
  }
}
```

---

### 📄 GET `/notes`

Retrieves all notes for the authenticated user.  
📎 **Why GET**: We're retrieving existing resources.  
📍 **Reads user ID from**: JWT token in the `Authorization` header.

```bash
curl 'https://ohfwwmignbjlgqsnbobc.supabase.co/functions/v1/get-notes' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

📦 **Sample Response**
```json
{
  "notes": [
    {
      "id": "783a6a49-5491-42cc-99bb-e37493e93baf",
      "user_id": "01ee4784-2eee-4eab-aa25-cbd249d26efd",
      "title": "My First Note",
      "content": "This is a test note created using a Supabase Edge Function.",
      "created_at": "2025-04-27T17:35:17.955845+00:00",
      "updated_at": "2025-04-27T17:35:17.955845+00:00"
    }
  ]
}
```

---

## 🚀 Setup & Deployment

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project  
➡️ [https://app.supabase.com](https://app.supabase.com)

### 3. Configure environment variables
Create a `.env` file with the following:
```bash
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Deploy your database schema
```bash
supabase db push
```

### 5. Create and deploy Edge Functions
```bash
> Create a function
$supabase functions new post-notes
> Deploy your function
$
supabase functions deploy post-notes --project-ref ohfwwmignbjlgqsnbobc 
> Invoke your function
$
curl -L -X POST 'https://ohfwwmignbjlgqsnbobc.supabase.co/functions/v1/post-notes' --header 'Content-Type: application/json' \
--data '{
  "user_id": "01ee4704-2eee-4eab-aa25-cbd249d26efd",
  "title": "Sample Note",
  "content": "This is a test note created using a Supabase Edge Function."
}'
```

## 🧪 Test with Postman

1. **Open Postman** and create a new request.

2. **Select request method**:
   - `POST` → `https://<your-project>.supabase.co/functions/v1/post-notes`
   - `GET` → `https://<your-project>.supabase.co/functions/v1/get-notes`

3. **Set headers**:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   Content-Type: application/json (only for POST)
   ```

4. **For POST request**, switch to the `Body` tab → `raw` → `JSON` format:
```json
{
  "user_id": "your_user_id",
  "title": "Note from Postman",
  "content": "This note was created using Postman!"
}
```

5. Click **Send**, and inspect the response JSON.
![Screenshot 2025-04-28 093753](https://github.com/user-attachments/assets/9ea16c48-eadb-4e05-b9fa-7140ce9a6751)

![Screenshot 2025-04-28 025746](https://github.com/user-attachments/assets/6b36f79a-e160-4f8d-9176-f93ca0fb98c4)
---

## 🔐 Security

- 🔐 **Authentication**: All API calls require a valid JWT (`Authorization: Bearer YOUR_ACCESS_TOKEN`).
- 🔄 **Data integrity**: Enforced via foreign key constraints.
- 🧹 **Cleanup**: Notes are automatically deleted when a user is removed (`ON DELETE CASCADE`).

---

## 📁 Project Structure

```
.
├── schema.sql
├── functions/
│   ├── post-notes.js   # POST /notes – reads body, inserts note
│   └── get-notes.js    # GET /notes – reads JWT, returns user’s notes
├── .env
└── README.md
```

---

## ✅ Deliverables Checklist

- [x] `schema.sql` – contains the `CREATE TABLE notes` statement  
- [x] `functions/post-notes.js` – handles creating notes (`POST /notes`)  
- [x] `functions/get-notes.js` – handles listing notes (`GET /notes`)  
- [x] Two working curl commands for both endpoints  
- [x] Deployment instructions using Supabase CLI  
- [x] "Why" comments for HTTP method and parameter sources  
- [x] Postman testing instructions

---

## 📌 Conclusion

This repo demonstrates a clean and secure pattern for building authenticated APIs with Supabase Edge Functions. It’s simple, serverless, and easy to scale. Feel free to expand this project with updates, deletions, and tagging features in the future!

---
