```markdown
# Promptful

**Promptful** is a modern prompt management tool designed to help you organize and manage AI prompts effortlessly. Built with React, TypeScript, Flask, and SQLite, this application offers a comprehensive solution for creating, editing, and categorizing your AI prompts.

---

## Features

- 🎯 **Prompt Creation & Management**: Easily create, edit, and organize AI prompts.
- 🔄 **Dynamic Variables**: Leverage a variable system for flexible and dynamic prompt templates.
- 🤖 **Multi-AI Model Support**: Compatible with multiple AI models (ChatGPT, Claude, etc.).
- 🏷️ **Categorization & Tagging**: Organize prompts with customizable categories and tags.
- 🔍 **Robust Search**: Perform full-text searches across titles, content, and categories.
- 📝 **Rich Text Editor**: Enjoy a seamless prompt creation experience with a rich text editor.
- 📱 **Responsive Design**: Access Promptful on any device with a mobile-first design.
- 📊 **Usage Analytics**: Gain insights with detailed analytics and statistics.
- ⚡ **High Performance**: Experience fast and efficient operations.
- 🌙 **Dark/Light Mode**: Toggle between dark and light themes for your comfort.

---

## Getting Started

### Prerequisites

- **Node.js**: Version 16+
- **Python**: Version 3.8+
- **PostgreSQL**: Ensure you have PostgreSQL installed and configured

> **Note:** Although Promptful is built with SQLite, PostgreSQL is required for certain production features.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/abdullah-elbedwehy/Promptful-prompt-management-app.git
   cd Promptful-prompt-management-app
   ```

2. **Install Dependencies**

   - For Node.js dependencies:

     ```bash
     npm install
     ```

   - For Python dependencies:

     ```bash
     pip install -r requirements.txt
     ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root by copying the example file:

   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**

   Launch the backend server:

   ```bash
   python run.py
   ```

5. **Access the Application**

   Open your browser and navigate to:  
   [http://localhost:5173](http://localhost:5173)

---

## Usage Guide

### Creating a Prompt

1. **Click "New Prompt"**: Start by clicking the "New Prompt" button.
2. **Enter Details**: Provide a title and description.
3. **Compose Your Prompt**: Use the rich text editor to craft your prompt.
4. **Add Variables**: Insert variables using the `{variable}` syntax.
5. **Categorize & Tag**: Select categories and tags to organize your prompt.
6. **Select AI Models**: Choose compatible AI models for your prompt.
7. **Save Your Prompt**: Click "Save" to store your prompt.

### Using Variables

Variables allow you to create dynamic and reusable prompts. There are two types:

- **Normal Variables**: Static placeholders that don’t change (e.g., `{content}`).
- **Multiple Choice Variables**: Placeholders with multiple options (e.g., `{tone|professional|casual|friendly}`).

#### Examples

- **Basic Variable:**

  ```plaintext
  Write a {tone} email to {recipient} about {topic}
  ```

- **Multiple Choice Variable:**

  ```plaintext
  Write a {tone|professional|casual|friendly} email to {recipient} about {topic} with a {mood|happy|serious|urgent} tone.
  ```

- **Combined Variables:**

  ```plaintext
  Write a {tone|professional|casual|friendly} response to {customer_name} regarding their {issue} with a {priority|high|medium|low} priority level.
  ```

### Managing Categories

- **Create Categories**: Add custom categories from the sidebar.
- **Organize Prompts**: Drag and drop prompts into categories.
- **Nested Categories**: Use nested categories for enhanced organization.
- **Filter by Category**: Easily filter prompts based on selected categories.

### Search Features

- **Full-Text Search**: Search across all prompt content.
- **Advanced Filters**: Refine searches by category, tags, AI model, date, and favorites.

### Version Control

- **Automatic Versioning**: Each edit creates a new version.
- **View History**: Access a complete edit history.
- **Restore & Compare**: Restore previous versions and compare changes.

### Analytics

Monitor your usage with detailed analytics:

- **Prompt Usage**: Track the most used prompts.
- **Category Trends**: Identify popular categories.
- **Variable Insights**: Analyze variable usage patterns.
- **AI Model Preferences**: See which AI models are most frequently selected.
- **Collaboration Stats**: View team collaboration metrics.

---

## Contributing

We welcome contributions! To contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add AmazingFeature"
   ```

4. **Push to Your Branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

---

## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.

---

## Support

For any questions or support, feel free to reach out via email:  
[abdullah.elbedwehy@gmail.com](mailto:abdullah.elbedwehy@gmail.com)
```