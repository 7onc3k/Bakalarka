# RealWorld Backend API Requirements

## Project Overview
The goal is to build a backend for a social blogging platform called "Conduit" (a clone of Medium.com). The API must adhere to RESTful principles and return JSON responses.

## 1. Authentication & Users

### User Stories
*   **Registration:** As a new user, I want to register using my username, email, and password.
*   **Login:** As a registered user, I want to login via email and password to receive a JWT token.
*   **Current User:** As a logged-in user, I want to get my own profile data and update my bio, email, or image.
*   **Profile:** As a user, I want to view other users' profiles (username, bio, image).

### Technical Constraints
*   Authentication is handled via JWT (JSON Web Token) in the `Authorization` header: `Token <jwt_token>`.
*   All user-related responses must wrap the data in a `user` object (e.g., `{ "user": { ... } }`).

## 2. Articles (CRUDS)

### User Stories
*   **Create:** As a logged-in user, I want to publish an article with a title, description, markdown body, and tags.
*   **Read (Global Feed):** As a user (even anonymous), I want to view a list of recent articles, filterable by tag, author, or "favorited by user".
*   **Read (Single):** As a user, I want to view a single article by its "slug".
*   **Read (Personal Feed):** As a logged-in user, I want to see a feed of articles strictly from authors I follow.
*   **Update:** As the author, I want to edit my article's title, description, or body.
*   **Delete:** As the author, I want to delete my article.

### Technical Constraints
*   The "slug" is generated from the title (e.g., "How to Train Your Dragon" -> "how-to-train-your-dragon").
*   Responses must wrap lists in `{ "articles": [], "articlesCount": 0 }`.

## 3. Comments

### User Stories
*   **Add Comment:** As a logged-in user, I want to comment on an article.
*   **View Comments:** As a user, I want to see all comments for a specific article.
*   **Delete Comment:** As the author of a comment, I want to delete it.

## 4. Social Interactions

### User Stories
*   **Follow:** As a logged-in user, I want to follow another author to see their posts in my feed.
*   **Unfollow:** As a logged-in user, I want to unfollow an author.
*   **Favorite:** As a logged-in user, I want to "like" (favorite) an article.
*   **Unfavorite:** As a logged-in user, I want to unlike an article.

## 5. Error Handling (Non-functional)

### Requirements
*   If a request fails (e.g., validation error), the API must return a `422 Unprocessable Entity` status code.
*   The error body must follow this exact format:
    ```json
    {
      "errors": {
        "body": ["can't be empty"],
        "email": ["is invalid"]
      }
    }
    ```
