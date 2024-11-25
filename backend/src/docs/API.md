## **API Response Format**

All API endpoints follow a standard response format:

```json
{
    "success": boolean,
    "data": any,
    "error"?: {
        "code": string,
        "message": string,
        "details"?: any
    },
    "meta"?: {
        "page": number,
        "limit": number,
        "total": number
    }
}
```

### **Problems Endpoints**

---

#### **GET `/api/problems`**

**Description:**
Fetches a list of problems with optional filters and pagination.

**Query Parameters:**

-   `divisions` (optional): Comma-separated list of division names and indexes to filter by. Example: `div2A,div3B,div4C`
-   `tags` (optional): Comma-separated list of tags to filter by. Example: `math,geometry`
-   `minRating` (optional): Minimum rating to include in results.
-   `maxRating` (optional): Maximum rating to include in results.
-   `codeforcesHandle` (optional): Codeforces handle to get the status of each problem ("solved", "attempted", or "new"), and/or to filter by problem status.
-   `status` (optional): Filter problems by one of "solved", "attempted", or "new" status.
-   `page` (optional): Page number for pagination (default: 1).
-   `limit` (optional): Number of problems per page (default: 20).

**Success Response:**

```json
{
	"success": true,
	"data": {
		"problems": [
			{
				"contestId": 1234,
				"index": "A",
				"name": "Problem Name",
				"tags": ["math", "dp"],
				"rating": 1500,
				"division": "div2",
				"problemId": "1234A",
				"status": "solved"
			}
		]
	},
	"meta": {
		"page": 1,
		"limit": 20,
		"total": 100
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Invalid input parameters",
		"details": [
			{
				"path": "minRating",
				"message": "Must be between 800 and 3500"
			}
		]
	}
}
```

**Field Descriptions:**

-   **data** (object):
    -   **problems** (array): An array of problem objects matching the filters.
        -   **contestId** (number): The unique ID of the contest the problem belongs to.
        -   **index** (string): The index of the problem within the contest (e.g., "A").
        -   **name** (string): The name/title of the problem.
        -   **tags** (array): An array of tags associated with the problem (e.g., ["math", "dp"]).
        -   **rating** (number): The rating of the problem, null for recent problems which haven't been rated on codeforces yet.
        -   **division** (string): The division the problem's context belongs to (e.g., "div2").
        -   **problemId** (string): The unique identifier for the problem (e.g., "1234A").
        -   **status** (string, optional): The status of the problem for the user ("solved", "attempted", or "new").
-   **meta** (object):
    -   **page** (number): Current page number
    -   **limit** (number): Number of items per page
    -   **total** (number): Total number of items available

**Response Codes:**

-   `200 OK`: Successfully fetched problems.
-   `400 Bad Request`: Invalid query parameters.

---

#### **GET `/api/problems/tags`**

**Description:**
Fetches the list of supported problem tags.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"tags": ["dp", "greedy", "math"]
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Invalid input parameters",
		"details": [
			{
				"path": "minRating",
				"message": "Must be between 800 and 3500"
			}
		]
	}
}
```

**Field Descriptions:**

-   **data** (object):
    -   **tags** (array): An array of strings representing the available problem tags.
-   **meta** (object):
    -   **total** (number): Total number of tags in the response.

**Response Codes:**

-   `200 OK`: Successfully fetched tags.

---

### **User Problem Status Endpoints**

---

#### **POST `/api/userproblemstatus/sync`**

**Description:**
Synchronizes the user's problem status by fetching new submissions from Codeforces.

**Query Parameters:**

-   `codeforcesHandle` (required): The Codeforces handle of the user.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"message": "Successfully synced user problem status"
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Codeforces handle is required"
	}
}
```

**Field Descriptions:**

-   **message** (string): A confirmation message indicating the result of the synchronization.

**Response Codes:**

-   `200 OK`: Successfully synchronized user problem status.
-   `400 Bad Request`: Missing `codeforcesHandle` parameter.
-   `500 Internal Server Error`: Failed to sync with Codeforces API.

---

#### **GET `/api/userproblemstatus`**

**Description:**
Fetches the problem status for a specific user based on their Codeforces handle.

**Notes:**

-   This endpoint doesn't use the codeforces API directly so it may return outdated data or no data at all for new users. To get the latest data, make sure to sync the user problem status through the `/api/userproblemstatus/sync` endpoint first.

**Query Parameters:**

-   `codeforcesHandle` (required): The Codeforces handle of the user.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"problems": [
			{ "problemId": "123A", "status": "solved" },
			{ "problemId": "456B", "status": "attempted" }
		]
	},
	"meta": {
		"total": 3
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Codeforces handle is required"
	}
}
```

**Field Descriptions:**

-   **data** (object):
    -   **problems** (array): An array of problem IDs or problem status objects.
-   **meta** (object):
    -   **total** (number): Total number of problems in the response.

**Response Codes:**

-   `200 OK`: Successfully fetched user problem status.
-   `400 Bad Request`: Missing `codeforcesHandle` parameter.
-   `404 Not Found`: User not found.

---

#### **GET `/api/userproblemstatus/unsolved`**

**Description:**
Fetches the list of problems that a user has attempted but not solved.

**Notes:**

-   This endpoint doesn't use the codeforces API directly so it may return outdated data or no data at all for new users. To get the latest data, make sure to sync the user problem status through the `/api/userproblemstatus/sync` endpoint first.

**Query Parameters:**

-   `codeforcesHandle` (required): The Codeforces handle of the user.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"problems": ["123A", "234B", "345C"]
	},
	"meta": {
		"total": 3
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Codeforces handle is required"
	}
}
```

**Field Descriptions:**

-   **data** (object):
    -   **problems** (array): An array of problem IDs that the user has attempted but not solved.
-   **meta** (object):
    -   **total** (number): Total number of unsolved problems for the user.

**Response Codes:**

-   `200 OK`: Successfully fetched unsolved problems.
-   `400 Bad Request`: Missing `codeforcesHandle` parameter.

---

#### **GET `/api/userproblemstatus/solved`**

**Description:**
Fetches the list of problems that a user has solved.

**Notes:**

-   This endpoint doesn't use the codeforces API directly so it may return outdated data or no data at all for new users. To get the latest data, make sure to sync the user problem status through the `/api/userproblemstatus/sync` endpoint first.

**Query Parameters:**

-   `codeforcesHandle` (required): The Codeforces handle of the user.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"problems": ["123A", "234B", "345C"]
	},
	"meta": {
		"total": 3
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Codeforces handle is required"
	}
}
```

**Field Descriptions:**

-   **data** (object):
    -   **problems** (array): An array of problem IDs that the user has solved.
-   **meta** (object):
    -   **total** (number): Total number of solved problems for the user.

**Response Codes:**

-   `200 OK`: Successfully fetched solved problems.
-   `400 Bad Request`: Missing `codeforcesHandle` parameter.

---

### **User Endpoints**

---

#### **POST `/api/users/login`**

**Description:**
Logs in or registers a new user by verifying their Firebase token.

**Success Response:**

```json
{
	"success": true,
	"data": {
		"message": "User registered or logged in",
		"user": {
			"id": "user123",
			"email": "user@example.com"
		}
	}
}
```

**Error Response:**

```json
{
	"success": false,
	"error": {
		"code": "AUTH_ERROR",
		"message": "Invalid Firebase token"
	}
}
```

**Field Descriptions:**

-   **message** (string): A confirmation message.

**Response Codes:**

-   `200 OK`: Successfully logged in or registered the user.
-   `400 Bad Request`: Invalid Firebase token.
-   `500 Internal Server Error`: Failed to process the login.

---

### **Common Error Codes**

-   `VALIDATION_ERROR`: Invalid input parameters
-   `AUTH_ERROR`: Authentication related errors
-   `NOT_FOUND`: Requested resource not found
-   `RATE_LIMIT`: Too many requests
-   `INTERNAL_ERROR`: Server encountered an unexpected condition

---
