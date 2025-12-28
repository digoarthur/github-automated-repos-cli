


<!------------------------------------ -------------------->
<!------------------------------------ PROJECT BANNER-->
<!------------------------------------ -------------------->

<img
  alt="banner_logo_github-automated-repos-cli"
  src="https://github.com/user-attachments/assets/328b1d74-7ef4-4dca-8bad-2657b10555ca"
/>

<br>
<br>

<!------------------------------------ -------------------->
<!------------------------------------ SHIELDS PROJECT -->
<!------------------------------------ -------------------->

<div align="center">

![GitHub](https://img.shields.io/github/license/digoarthur/github-automated-repos-cli?color=9F9FAC)
![NPM Package](https://img.shields.io/npm/v/github-automated-repos-cli?color=blue&label=NPM%20package&logo=npm&logoColor=CB3837)
![CodeFactor](https://img.shields.io/codefactor/grade/github/digoarthur/github-automated-repos-cli?color=brightgreen&label=Code%20Quality&logo=codefactor)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

</div>

<!------------------------------------ ---------------------------->
<!------------------------------------ PROJECT DESCRIPTION -->
<!------------------------------------ --------------------------->

<p align="center">
  <br>
   <strong>github-automated-repos-cli</strong> is a <code>command-line tool</code>designed to bootstrap and automate example pages
  using <a href="https://github.com/digoarthur/github-automated-repos"><strong>github-automated-repos</strong></a>
   library in modern frontend projects.
  <br><br>

 > It helps you quickly generate interactive demo pages for GitHub repositories without manually wiring APIs,
  editing repetitive files, or handling complex setup steps.

</p>

---



<!------------------------------------ -------------------->
<!------------------------------------ DOCUMENTATION -->
<!------------------------------------ -------------------->

## Documentation

This CLI works on top of the **github-automated-repos** library.

- 📦 [github-automated-repos](https://github.com/digoarthur/github-automated-repos).

---

<!------------------------------------ -------------------->
<!------------------------------------ GETTING STARTED -->
<!------------------------------------ -------------------->

#  Getting Started


## 1. Run Command


```bash
npx github-automated-repos-cli init

```

## 2. Enter data

#### 🦑 GitHub Username

You will be prompted to enter your GitHub username.

This is used to fetch your public repositories directly from GitHub.

```yaml
✔ GitHub username: xxxxxx

```

#### 🔑 Keyword (Repository Filter)

Next, you’ll choose a keyword (for example: <code> attached  </code>,  <code>portfolio </code>,  <code>featured </code>).

This keyword will be used to filter repositories via the GitHub Topics field.

```yaml
✔ Keyword to filter (e.g. 'attached'): attached
```

> [!IMPORTANT]
> Don't forget to enter your Keyword in the Topics field of each project so it appears on the generated page.


![image](https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/9a0a0aaf-02e8-4a7f-8390-6e7fb4a3ea53)



## 3. Page Generation

 Once confirmed, the CLI will:
- Generate the project page
- Inject the correct logic
- Connect it to github-automated-repos
- Finalize the template

## 4. Result

Your project page is now ready 🎉

```arduino
✨ Your project page is ready!
🔗 http://localhost:3000/projects
```
--- 

## Supported Framework Paths

 ### <img height="30" alt="Group 43" src="https://github.com/user-attachments/assets/205fcbe6-c973-4d0b-a04a-e9d8f88b75b5" /> Next.js (App Router)


```arduino
app/projects/page.tsx
```

### <img alt="dashgo_layout" height="30" src="https://github.com/user-attachments/assets/53f73492-e6b0-4121-95cc-d291630759de">  ViteJS

```arduino
src/pages/projects.tsx
```







<br> 


---

<br>  

       

**Love github-automated-repos CLI? Give our repo a star ⭐ [⬆️](https://github.com/DIGOARTHUR/github-automated-repos-cli) .**


`based in:` [Api Github](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository) 

`by`: [@digoarthur](https://www.linkedin.com/in/digoarthur/) <a href="https://youtu.be/dQw4w9WgXcQ?si=VBzREBlncKuPTYBs"> <img src="https://github.com/user-attachments/assets/f45f0115-761e-4207-a9d9-dddacfb5b96b" alt="Brazil Flag" width="20" /> </a> 


<div align="center">
    
**[github-automated-repos](https://github.com/digoarthur/github-automated-repos)**

</div>

