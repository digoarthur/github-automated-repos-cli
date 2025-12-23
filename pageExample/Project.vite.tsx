import { useGitHubAutomatedRepos, StackIcons, StackLabels } from "github-automated-repos";

export default function Projects() {

  const { data, isLoading } = useGitHubAutomatedRepos("__GITHUB_USERNAME__", "__KEYWORD__");
  if (isLoading) return <p>Loading...</p>;

  return (

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: 'sans-serif', padding: '0rem', background: "white" }}>
      <img style={{ width: '60rem', marginBottom: '4rem' }} src="https://github.com/user-attachments/assets/f0fbbf5a-fb96-49ec-8be4-c7b9e7b0b17b" alt="Header" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '1000px',
        marginBottom: '3rem',
        fontFamily: 'Inter, Poppins, sans-serif'
      }}>

        {/* CARD 1 */}

        <div style={{ position: 'relative', padding: '2rem 1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}> <div style={{ position: 'absolute', top: '-25px', left: '-25px', width: '60px', height: '60px', color: '#242938', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: '750' }}>1</div> <div style={{ position: 'absolute', top: '-25px', right: '-5px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <img src="https://i.ibb.co/r10PVVm/hook-svgrepo-com.png" alt="hook icon" style={{ width: '70px', height: '70px', objectFit: 'contain' }} /> </div> <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.8rem' }}>Set up the Hook</h3> <p style={{ color: '#6b7280', lineHeight: '1.5', borderLeft: '3px solid #d0d7de', paddingRight: '12px', background: '#f6f8fa', padding: '4px 4px' }}>In the code, adjust the <strong>githubUsername</strong> and <strong>keyword</strong> in the hook — the keyword is chosen by you.</p> <code style={{ background: '#1e1e1e', padding: '8px 12px', borderRadius: '6px', color: 'white', display: 'block', marginTop: '8px', fontFamily: 'monospace' }}> <span style={{ color: '#DCDCAA' }}>useGitHubAutomatedRepos</span> <span style={{ color: '#DA64A1' }}>(</span> <br /> <span style={{ color: '#CE9178' }}>"githubUsername"</span> <span style={{ color: 'white' }}>,</span> <span style={{ color: '#CE9178' }}>"your-keyword"</span> <span style={{ color: '#DA64A1' }}>)</span> </code> </div>

        {/* CARD 2 */}

        <div style={{ position: 'relative', padding: '2rem 1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}> <div style={{ position: 'absolute', top: '-25px', left: '-25px', width: '60px', height: '60px', color: '#242938', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: '750' }}>2</div> <div style={{ position: 'absolute', top: '-25px', right: '-5px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <img src="https://i.ibb.co/s9362fk9/github-svgrepo-com-2-1.png" alt="github icon" style={{ width: '70px', height: '70px', objectFit: 'contain' }} /> </div> <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.8rem' }}>Select Your Repositories</h3> <p style={{ fontSize: '15px', color: '#f04842', fontWeight: '600', marginBottom: '0.5rem' }}>Don't forget to fill in:</p> <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '5px' }}> <li style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>Repository description<a href="https://github.com/digoarthur/github-automated-repos" style={{ display: 'inline-flex' }}><img src="https://i.ibb.co/9mKTb09L/info-svgrepo-com.png" alt="info" style={{ width: '14px', height: '14px' }} /></a></li> <li style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}> <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Project banner<a href="https://github.com/digoarthur/github-automated-repos" style={{ display: 'inline-flex' }}><img src="https://i.ibb.co/9mKTb09L/info-svgrepo-com.png" alt="info" style={{ width: '14px', height: '14px' }} /></a></div> <code style={{ color: '#111', marginLeft: '0px' }}>/public/bannerXYZ.png</code> </li> <li style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>Technology logos (<strong>Topics</strong>)<a href="https://github.com/digoarthur/github-automated-repos" style={{ display: 'inline-flex' }}><img src="https://i.ibb.co/9mKTb09L/info-svgrepo-com.png" alt="info" style={{ width: '14px', height: '14px' }} /></a></li> </ul> <div style={{ display: 'flex', gap: '3px', marginLeft: '1.5rem', marginTop: '5px' }}> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/876a12c4-93fa-4eb3-908c-b7c36ded395c" alt="react-icons" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/6cad1fdc-d3bb-4adb-9b14-bec1977aaee1" alt=".NET Core" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/8690e53e-5787-48b1-8adc-29c90e56fd42" alt="MySQL" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/7cd5a1ec-ea87-4d7e-8429-1e3fcff03f49" alt="MongoDB" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/79ac45a3-5958-4efe-a3e6-90c135d2b466" alt="Linux" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/07dcaa25-215a-45a8-b783-2c97626c1639" alt="Vue" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/05cf8a94-895c-4249-8636-f1d2a0ea165b" alt="Vite" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/ebd5f88a-7915-4cb5-9109-6f3fc5db9fec" alt="TypeScript" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/6af503c9-efdc-4e83-9ba7-c910476a8642" alt="Tailwind" style={{ width: '15px', height: '15px' }} /> <img src="https://github.com/DIGOARTHUR/github-automated-repos/assets/59892368/355549ea-87e2-4afd-83a9-2f9cb56c7c49" alt="Swift" style={{ width: '15px', height: '15px' }} /> </div>  </div>
        {/* CARD 3 */}

        <div style={{ position: 'relative', padding: '2rem 1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}> <div style={{ position: 'absolute', top: '-25px', left: '-25px', width: '60px', height: '60px', color: '#242938', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: '750' }}>3</div> <div style={{ position: 'absolute', top: '-25px', right: '-5px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <img src="https://i.ibb.co/qYkT7kCm/key-svgrepo-com-1.png" alt="key icon" style={{ width: '70px', height: '70px', objectFit: 'contain' }} /> </div> <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.8rem' }}>Add the Keyword</h3> <p style={{ color: '#6b7280', lineHeight: '1.5', borderLeft: '3px solid #d0d7de', paddingRight: '12px', background: '#f6f8fa', padding: '4px 4px' }}>In your repository: <br /><strong style={{ fontSize: '13px' }}>About → ⚙️ → Topics</strong></p> <div style={{ background: '#0D1117', border: '1px solid #d0d7de', marginTop: '8px', borderRadius: '6px', padding: '8px', fontFamily: 'system-ui, sans-serif' }}> <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Topics <span style={{ color: '#757B83' }}>(separate with spaces)</span></div> <div style={{ background: '#0D1117', border: '1px solid #3D444D', borderRadius: '6px', padding: '8px 12px', minHeight: '34px', display: 'flex' }}> <span style={{ background: '#121D2F', color: '#2A85F8', padding: '0px 0px 0px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '2px' }}>keyword<span style={{ background: '#162844', color: '#4493F8', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>X</span></span> </div>  </div>   <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', fontWeight: '600', color: '#16a34a', letterSpacing: '0.3px' }} > ✅ Check out the cards below! </p></div> </div>
      {/* === 🔹 END OF CARDS === */}

      {/* === 🔹 REPOSITORY DATA === */}
      {data?.map((repo) => (
        <section key={repo.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', width: "550px" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{repo.name}</h2>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {repo.banner.map((url) => <img key={url} src={url} style={{ maxWidth: '250px', borderRadius: '4px', margin: '0 2px' }} alt="Banner" />)}
          </div>

          <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
            {repo.topics.map((stackName) => (
              <span key={stackName} style={{ marginRight: '8px', display: 'flex', gap: '0.2rem' }}>
                <StackIcons itemTopics={stackName} /><StackLabels itemTopics={stackName} />
              </span>
            ))}
          </div>

          <p style={{ maxWidth: '700px', margin: '1rem auto', color: '#555' }}>{repo.description}</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={repo.homepage} target="_blank" style={{ color: '#646cff', textDecoration: 'none' }}>🔗 Homepage</a>
            <a href={repo.html_url} target="_blank" style={{ color: '#646cff', textDecoration: 'none' }}>🔗 Repository</a>
          </div>
        </section>
      ))}

      <footer style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eaeaea', fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <strong> Love github-automated-repos? Give our repo a star 🌟➡️ : </strong>
            <a href="https://github.com/DIGOARTHUR/github-automated-repos" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff', textDecoration: 'none', fontWeight: 'bold', marginLeft: '0.3rem' }}>github-automated-repos</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <em>Created by:</em>
            <a href="https://www.linkedin.com/in/digoarthur/" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff', textDecoration: 'none' }}>@digoarthur</a>
            <a href="https://youtu.be/dQw4w9WgXcQ?si=VBzREBlncKuPTYBs" style={{ display: 'inline-flex' }}><img src="https://github.com/user-attachments/assets/f45f0115-761e-4207-a9d9-dddacfb5b96b" alt="Brazil Flag" width="20" style={{ verticalAlign: 'middle' }} /></a>
          </div>
        </div>
        <div style={{ color: '#888', fontSize: '0.8rem' }}>
          <em>Powered by </em>
          <a href="https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff', textDecoration: 'none' }}>GitHub API</a>
        </div>
      </footer>
    </div>
  );
}
