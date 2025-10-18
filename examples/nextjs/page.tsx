"use client";
import React from "react";

"use client";
import { useGitHubAutomatedRepos, StackIcons, StackLabels } from "github-automated-repos";


export default function Home() {

  const { data, isLoading } = useGitHubAutomatedRepos('digoarthur', 'attached');
  if (isLoading) return <p>Loading...</p>;
  
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", fontFamily: 'sans-serif', padding: '1rem', background:"white" }}>
      <img style={{ width: '60rem' }} src="https://github.com/user-attachments/assets/f0fbbf5a-fb96-49ec-8be4-c7b9e7b0b17b" alt="Header"/>
      
      {data?.map((repo) => (
        <section key={repo.name} style={{ display:"flex", flexDirection:"column", alignItems:"center",marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px',width:"550px" }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{repo.name}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {repo.banner.map((url) => <img key={url} src={url} style={{ maxWidth: '250px', borderRadius: '4px', margin: '0 2px' }} alt="Banner"/>)}
          </div>
          
          <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
            {repo.topics.map((stackName) => (
              <span key={stackName} style={{ marginRight: '8px', display: 'flex', gap: '0.2rem' }}>
                <StackIcons itemTopics={stackName}/><StackLabels itemTopics={stackName}/>
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
            <a href="https://youtu.be/dQw4w9WgXcQ?si=VBzREBlncKuPTYBs" style={{ display: 'inline-flex' }}><img src="https://github.com/user-attachments/assets/f45f0115-761e-4207-a9d9-dddacfb5b96b" alt="Brazil Flag" width="20" style={{ verticalAlign: 'middle' }}/></a>
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
