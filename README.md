

# **PortFolio**

Easy to use portfolio builder where you can create a portfolio page automatically by just providing your GitHub username. You can make your own copy.

To view a live example, **[click here](https://suign.github.io/portfolio)**.


## 🛠 Installation & Setup

There are three ways to use **GitProfile**. Use any.

- [Forking this repo _(recommended)_](#forking-this-repo)
- [Setting up locally](#setting-up-locally)
- [Installing as package](#installing-as-package)

### Forking this repo

These instructions will get you a copy of the project and deploy your portfolio online using GitHub Pages!

- **Fork repo:** Click [here](https://github.com/arifszn/gitprofile/fork) to fork the repo so you have your own project to customize. A "fork" is a copy of a repository.
- **Rename repo:**
  - If you want to host your portfolio at `https://<USERNAME>.github.io`, rename your forked repository to `username.github.io` in GitHub, where `username` is your GitHub username (or organization name).
  - If you want to host your portfolio at `https://<USERNAME>.github.io/<REPO_NAME>` (e.g. `https://<USERNAME>.github.io/portfolio`), rename your forked repository to `<REPO_NAME>` (e.g. `portfolio`) in GitHub.
- **Enable workflows:** Go to your repo's **Actions** tab and enable workflows.

- **Base Value:** Open `vite.config.js`, and change `base`'s value.

  - If you are deploying to `https://<USERNAME>.github.io`, set `base` to `'/'`.

  - If you are deploying to `https://<USERNAME>.github.io/<REPO_NAME>` (e.g. `https://<USERNAME>.github.io/portfolio`), then set `base` to `'/<REPO_NAME>/'` (e.g. `'/portfolio/'`).

  ```js
  // vite.config.js
  {
    base: '/',
    // ...
  }
  ```

- **Commit the changes:** Now commit to your **main** branch with your changes. Wait a few minutes so that the CI/CD pipeline can publish your website to GitHub Pages. You can check the progress in the [Actions](https://github.com/arifszn/gitprofile/actions) tab.

Your portfolio website will be live shortly. Any time you commit a change to the **main** branch, the website will be automatically updated. If you face any issue viewing the website, double-check the `base` value in the `vite.config.js` file. Also, check if **Source** is set to **GitHub Actions** in **Settings** ➜ **Pages** ➜ **Build and deployment**.

If you wish to add a custom domain, no CNAME file is required. Just add it to your repo's **Settings** ➜ **Pages** ➜ **Custom domain**.

As this is a Vite project, you can also host your website to Netlify, Vercel, Heroku, or other popular services. 

Please refer to this [doc](https://vitejs.dev/guide/static-deploy.html) for a detailed deployment guide to other services. Also, if you are not deploying to GitHub pages, `base:` might need to be deleted from `vite.config.js`.

### Setting up locally

- Clone the project and change directory.

  ```shell
  git clone https://github.com/suign/portfolio.git
  cd portfolio
  ```

- Install dependencies.

  ```shell
  npm install
  ```

- Run dev server.

  ```shell
  npm run dev
  ```

- Finally, visit [`http://localhost:5173/portfolio/`](http://localhost:5173/gitprofile/) from your browser.

### Installing as package

You can also use **GitProfile** by installing as an NPM package.

First Install **GitProfile** via <a href="https://www.npmjs.com/package/@arifszn/gitprofile">NPM</a>.

```sh
npm install @arifszn/gitprofile
```

Then, import the package, import and style and provide the config.

```js
import GitProfile from '@arifszn/gitprofile';
import '@arifszn/gitprofile/dist/style.css';

function App() {
  return (
    <GitProfile
      config={{
        github: {
          username: 'arifszn',
        },
      }}
    />
  );
}

export default App;
```

List of all config [here](#-customization).

**If you face any problems or have any questions, open an issue [here](https://github.com/arifszn/gitprofile/issues).**

## 🎨 Customization

All the magic happens in the file `gitprofile.config.js`. Open it and modify it according to your preference.

### Themes

There are 30 themes available that can be selected from the dropdown.

The default theme can be specified.

```js
// gitprofile.config.js
const config = {
  // ...
  themeConfig: {
    defaultTheme: 'light',
    // ...
  },
};
```


You can create your own custom theme by modifying these values. Theme `procyon` will have the custom styles.

```js
// gitprofile.config.js
const config = {
  // ...
  themeConfig: {
    customTheme: {
      primary: '#fc055b',
      secondary: '#219aaf',
      accent: '#e8d03a',
      neutral: '#2A2730',
      'base-100': '#E3E3ED',
      '--rounded-box': '3rem',
      '--rounded-btn': '3rem',
    },
    // ...
  },
};
```

### Google Analytics

**GitProfile** supports both GA3 and GA4. If you do not want to use Google Analytics, keep the `id` empty.

```js
// gitprofile.config.js
const config = {
  // ...
  googleAnalytics: {
    id: '',
  },
};
```

Besides tracking visitors, it will track `click events` on projects and blog posts, and send them to Google Analytics.

### SEO

Meta tags will be auto-generated from configs dynamically. However, you can also manually add meta tags in `public/index.html`.

### Avatar and Bio

Your avatar and bio will be fetched from GitHub automatically.

### Social Links

You can link your social media services you're using, including LinkedIn, Twitter, Mastodon, Facebook, Instagram, YouTube, Dribbble, Behance, Medium, dev, Stack Overflow, Skype, Telegram, personal website, phone and email.

```js
// gitprofile.config.js
const config = {
  // ...
  social: {
    linkedin: 'suign',
    twitter: 'suign',
    mastodon: '',
    facebook: '',
    instagram: 'jabella.e',
    youtube: '',
    dribbble: '',
    behance: '',
    medium: 'suign',
    dev: '',
    stackoverflow: '',
    skype: '',
    telegram: '',
    website: 'abellae.me',
    phone: '',
    email: 'me@neurons.me',
  },
};
```

### Skills

To showcase your skills provide them here.

```js
// gitprofile.config.js
const config = {
  // ...
  skills: ['JavaScript', 'React.js'],
};
```

Empty array will hide the skills section.

### Experience

Provide your job history in `experiences`.

```js
// gitprofile.config.js
const config = {
  // ...
  experiences: [
    {
      company: 'Company Name',
      position: 'Position',
      from: 'September 2021',
      to: 'Present',
      companyLink: 'https://example.com',
    },
    {
      company: 'Company Name',
      position: 'Position',
      from: 'July 2019',
      to: 'August 2021',
      companyLink: 'https://example.com',
    },
  ],
};
```

Empty array will hide the experience section.

### Education
Provide your education history in `education`.
```js
// gitprofile.config.js
const config = {
  // ...
  education: [
    {
      institution: 'Institution name 1',
      degree: 'Bachelor of Science',
      from: '2015',
      to: '2019',
    },
    {
      institution: 'Institution name 2',
      degree: 'Higher Secondary Certificate (HSC)',
      from: '2012',
      to: '2014',
    },
  ],
};
```
Empty array will hide the education section.

### Certifications
Provide your industry certifications in `certifications`.
```js
// gitprofile.config.js
const config = {
  // ...
  certifications: [
    {
      name: 'Lorem ipsum',
      body: 'Lorem ipsum dolor sit amet',
      year: 'March 2022',
      link: 'https://example.com',
    },
  ],
};
```
Empty array will hide the certifications section.

### Projects

#### Github Projects

Your public repo from GitHub will be displayed in the `Github Projects` section automatically. You can limit how many projects do you want to be displayed. Also, you can hide forked or specific repo.

```js
// gitprofile.config.js
const config = {
  // ...
  github: {
    username: 'arifszn',
    sortBy: 'stars',
    limit: 8,
    exclude: {
      forks: false,
      projects: ['my-project1', 'my-project2'],
    },
  },
};
```

#### External Projects
In this section you can showcase your external/personal projects.
```js
// gitprofile.config.js
const config = {
  // ...
  externalProjects: [
    {
      title: 'Project Name',
      description: 'Description',
      link: 'https://example.com',
      imageUrl: 'https://via.placeholder.com/250x250',
    },
  ],
};
```

### Blog Posts
If you have [medium](https://medium.com) or [dev](https://dev.to) account, you can show your recent blog posts in here just by providing your medium/dev username. You can limit how many posts to display (Max is `10`).

```js
// gitprofile.config.js
const config = {
  // ...
  blog: {
    source: 'dev',
    username: 'arifszn',
    limit: 5,
  },
};
```

![Blog](https://arifszn.netlify.app/assets/img/hosted/gitprofile/blog.png)

## Support

<p>You can show your support by starring this project. ★</p>
## 📄 License

[MIT](https://github.com/arifszn/gitprofile/blob/main/LICENSE)
