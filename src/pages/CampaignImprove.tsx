import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCampaigns } from '@/lib/mock-data';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const presetPrompts = [
  'Optimize subject line',
  'Change image',
  'Adapt to VIP segment',
  'Target CR ≥ 3%',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CampaignImprove() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `J'ai analysé votre variant. Voici mes recommandations pour améliorer les performances :

📊 **CTR actuel : ${campaign.clickThroughRate}%** - Légèrement sous la cible de 5%
• Optimisez le titre avec un appel à l'action plus fort
• Testez un placement du bouton CTA plus visible

💰 **CR actuel : ${campaign.conversionRate}%** - Au-dessus de la cible de 5%
• Excellent ! Conservez cette structure
• Envisagez d'augmenter la cible à 7%

🎯 **Actions prioritaires :**
1. Renforcer l'urgence dans le titre
2. Améliorer le contraste du bouton principal
3. Simplifier le parcours utilisateur

Que souhaitez-vous optimiser en premier ?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!campaign) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </AppShell>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setHasUnsavedChanges(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I've analyzed your request. Here's my suggestion: Consider using a more action-oriented subject line with urgency. I can also recommend updating the hero image to showcase product benefits more clearly.",
        },
      ]);
    }, 1000);
  };

  const handlePresetClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(`/campaign/${id}`)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Button>
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Left: AI Chat */}
          <div className="bg-card rounded-lg border border-border-subtle shadow-card flex flex-col">
            <div className="p-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">AI Co-pilot</h3>
                  <p className="text-xs text-muted-foreground">Campaign optimization assistant</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border-subtle space-y-3">
              <div className="flex flex-wrap gap-2">
                {presetPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetClick(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="bg-background"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-card rounded-lg border border-border-subtle shadow-card flex flex-col">
            <div className="p-4 border-b border-border-subtle">
              <Tabs defaultValue="current" className="w-full">
                <TabsList>
                  <TabsTrigger value="current">Current version</TabsTrigger>
                  <TabsTrigger value="ai">Suggested version</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-muted/20 rounded-lg border border-border-subtle flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Campaign Preview</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-heading font-semibold mb-2">{campaign.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Preview of campaign creative with all optimizations applied in real-time.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border-subtle">
                    <p className="text-xs text-muted-foreground mb-2">Current metrics</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">CR</p>
                        <p className="font-medium">{campaign.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium">{campaign.clickThroughRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border-subtle flex items-center justify-between gap-3">
              <Button variant="outline" size="sm">
                Version history
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Compare with current
                </Button>
                <Button size="sm">Test in production</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
