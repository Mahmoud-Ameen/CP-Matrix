## **API Endpoints Documentation**

### **Problems Endpoints**

---

#### **GET `/api/problems`**

**Description:**
Fetches a list of problems with optional filters and pagination.

**Query Parameters:**

-   `divisions` (optional): JSON string with an array of division names and indexes to filter by. Example: `["div2A", "div3B", "div4C"]`
-   `tags` (optional): JSON string with an array of tags to filter by. Example: `["math", "geometry"]`
-   `minRating` (optional): Minimum rating to include in results.
-   `maxRating` (optional): Maximum rating to include in results.
-   `codeforcesHandle` (optional): Codeforces handle to get the status of each problem ("solved", "attempted", or "new"), and/or to filter by problem status.
-   `status` (optional): Filter problems by one of "solved", "attempted", or "new" status.
-   `page` (optional): Page number for pagination (default: 1).
-   `limit` (optional): Number of problems per page (default: 20).

**Response Structure:**

```json
{
	"totalProblemsCount": 100,
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
}
```

**Field Descriptions:**

-   **totalProblemsCount** (number): The total number of problems matching the filters applied, regardless of pagination.
-   **problems** (array): An array of problem objects matching the filters.
    -   **contestId** (number): The unique ID of the contest the problem belongs to.
    -   **index** (string): The index of the problem within the contest (e.g., "A").
    -   **name** (string): The name/title of the problem.
    -   **tags** (array): An array of tags associated with the problem (e.g., ["math", "dp"]).
    -   **rating** (number): The rating of the problem, null for recent problems which haven't been rated on codeforces yet.
    -   **division** (string): The division the problem's context belongs to (e.g., "div2").
    -   **problemId** (string): The unique identifier for the problem. made up of contest ID and problem index (e.g., "1234A").
    -   **status** (string, optional): The status of the problem for the user, indicating if it's "solved", "attempted", or "new" (only included if `codeforcesHandle` is provided).

**Response Codes:**

-   `200 OK`: Successfully fetched problems.
-   `400 Bad Request`: Invalid query parameters.

---

#### **GET `/api/problems/tags`**

**Description:**
Fetches the list of supported problem tags.

**Response Structure:**

```json
{
	"tags": ["dp", "greedy", "math"]
}
```

**Field Descriptions:**

-   **tags** (array): An array of strings representing the available problem tags.

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

**Response Structure:**

```json
{
	"message": "Successfully synced user problem status"
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

**Response Structure:**

```json
{
	"count": 3,
	"problems": [
		{ "problemId": "123A", "status": "solved" },
		{ "problemId": "456B", "status": "attempted" },
		{ "problemId": "1000C", "status": "attempted" }
	]
}
```

**Field Descriptions:**

-   **count** (number): The total number of problems associated with the user’s Codeforces handle.
-   **problems** (array): An array of problem objects with the user's status.
    -   **problemId** (string): The unique identifier for the problem.
    -   **status** (string): The user's status for the problem, indicating if it's "solved", "attempted", etc.

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

**Response Structure:**

```json
{
	"count": 3,
	"problems": ["123A", "234B", "345C"]
}
```

**Field Descriptions:**

-   **count** (number): The total number of unsolved problems for the user.
-   **problems** (array): An array of problem IDs that the user has attempted but not solved.

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

**Response Structure:**

```json
{
	"count": 7,
	"problems": ["123A", "234B", "345C", "456D", "567E", "678F", "789G"]
}
```

**Field Descriptions:**

-   **count** (number): The total number of solved problems for the user.
-   **problems** (array): An array of problem IDs that the user has solved.

**Response Codes:**

-   `200 OK`: Successfully fetched solved problems.
-   `400 Bad Request`: Missing `codeforcesHandle` parameter.

---

### **User Endpoints**

---

#### **POST `/api/users/login`**

**Description:**
Logs in or registers a new user by verifying their Firebase token.

**Response Structure:**

```json
{
	"message": "User registered or logged in"
}
```

**Field Descriptions:**

-   **message** (string): A confirmation message.

**Response Codes:**

-   `200 OK`: Successfully logged in or registered the user.
-   `400 Bad Request`: Invalid Firebase token.
-   `500 Internal Server Error`: Failed to process the login.

---
