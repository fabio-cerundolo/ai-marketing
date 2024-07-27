// components/AIMarketingAnalyzer.js
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const analyzeWithAI = async (url) => {
  const aiPrompt = `
  Analizza il sito web ${url} e fornisci le seguenti informazioni:
  1. Una breve descrizione del contenuto del sito
  2. Una valutazione del SEO score (da 0 a 100)
  3. Le principali keyword e la loro densità
  4. Una strategia di marketing consigliata
  5. Suggerimenti per post sui social media (Facebook, Twitter, Instagram, LinkedIn)
  Formatta la tua risposta in JSON.
  `;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "mistral",
      prompt: aiPrompt,
      max_tokens: 500
    })
  });

  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].text.trim());
  return analysis;
};


const AIMarketingAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeWebsite = async () => {
    setLoading(true);
    try {
      const aiAnalysis = await analyzeWithAI(url);
      setAnalysis(aiAnalysis);
    } catch (error) {
      console.error("Error during AI analysis:", error);
      // Gestione degli errori
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">AI Marketing Analyzer</h1>
    <Alert className="mb-4">
    <AlertTitle>Nota</AlertTitle>
    <AlertDescription>
    Questa applicazione utilizza l'AI per analizzare il sito web inserito. I risultati potrebbero variare e sono basati su un'analisi in tempo reale.
    </AlertDescription>
    </Alert>
    <div className="flex space-x-2 mb-4">
    <Input
    type="url"
    placeholder="Inserisci l'URL del sito web"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    />
    <Button onClick={analyzeWebsite} disabled={loading || !url}>
    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Analizza"}
    </Button>
    </div>
    {analysis && (
      <div className="space-y-4">
      <Card>
      <CardHeader>
      <CardTitle>Analisi del sito</CardTitle>
      </CardHeader>
      <CardContent>
      <p>{analysis.description}</p>
      <div className="mt-4">
      <h3 className="font-semibold">SEO Score: {analysis.seoScore}/100</h3>
      <progress value={analysis.seoScore} max="100" className="w-full" />
      </div>
      </CardContent>
      </Card>
      <Card>
      <CardHeader>
      <CardTitle>Keyword Density</CardTitle>
      </CardHeader>
      <CardContent>
      <ul>
      {Object.entries(analysis.keywords).map(([keyword, density]) => (
        <li key={keyword}>{keyword}: {density}%</li>
      ))}
      </ul>
      </CardContent>
      </Card>
      <Card>
      <CardHeader>
      <CardTitle>Strategia di Marketing</CardTitle>
      </CardHeader>
      <CardContent>
      <p>{analysis.marketingStrategy}</p>
      </CardContent>
      </Card>
      <Card>
      <CardHeader>
      <CardTitle>Suggerimenti per i Social Media</CardTitle>
      </CardHeader>
      <CardContent>
      <Tabs defaultValue="facebook">
      <TabsList>
      <TabsTrigger value="facebook"><Facebook className="mr-2" /> Facebook</TabsTrigger>
      <TabsTrigger value="twitter"><Twitter className="mr-2" /> Twitter</TabsTrigger>
      <TabsTrigger value="instagram"><Instagram className="mr-2" /> Instagram</TabsTrigger>
      <TabsTrigger value="linkedin"><Linkedin className="mr-2" /> LinkedIn</TabsTrigger>
      </TabsList>
      {Object.entries(analysis.socialSuggestions).map(([platform, posts]) => (
        <TabsContent value={platform} key={platform}>
        <ul className="list-disc pl-5">
        {posts.map((post, index) => (
          <li key={index} className="mb-2">{post}</li>
        ))}
        </ul>
        </TabsContent>
      ))}
      </Tabs>
      </CardContent>
      </Card>
      </div>
    )}
    </div>
  );
};

export default AIMarketingAnalyzer;
