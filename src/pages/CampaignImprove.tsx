import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { TypewriterText } from '@/components/chat/TypewriterText';
import { mockCampaigns } from '@/lib/mock-data';
import { ArrowLeft, Send, Sparkles, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import campaignCurrentImage from '@/assets/campaign-current.png';
import phoneContainerImage from '@/assets/phone-container.png';

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

interface CampaignVersion {
  image: string;
  title: string;
  description: string;
  buttonPosition: 'top' | 'center' | 'bottom';
  buttonText: string;
}

export default function CampaignImprove() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find((c) => c.id === id);
  
  const [currentVersion, setCurrentVersion] = useState<CampaignVersion>({
    image: campaignCurrentImage,
    title: 'Keep your status with the ALL PLUS ibis+ or Voyageur card',
    description: 'Subscribe now and receive 10 bonus Status Nights – that\'s a real boost to help you reach your goal. Plus, enjoy 20% off stays at selected brands until January 14.',
    buttonPosition: 'center',
    buttonText: 'Discover the card',
  });

  const [suggestedVersion, setSuggestedVersion] = useState<CampaignVersion>({
    image: phoneContainerImage,
    title: '🎁 Keep your status with ALL Accor+ Card.',
    description: "Subscribe now and receive 10 bonus Status Nights – that's a real boost to help you reach your goal. Plus, enjoy 20% off your stays at selected brands until January 14.",
    buttonPosition: 'bottom',
    buttonText: 'Discover the card',
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I have analysed your variant. Here are my recommendations for improving performance:

📊 **Current CTR: 4.2%** - Slightly below the target of 5%
• Optimise the title with a stronger call to action. I suggest: "🎁 Keep your status with ALL Accor+ Card. "

• Test a more visible placement for the CTA button and change the wording. My recommendation: « I Stay Gold »

💰 **Current CR: 2.4%** - Above the target of 5%
• Excellent! Keep this structure
• Consider increasing the target to 7%  I also replaced the visual with another one available in the library

🎯 **Priority actions:**
1. Reinforce the urgency in the title
2. Improve the contrast of the main button 3. Test another visual`,
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

        {/* Resizable two-pane layout */}
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-12rem)] rounded-lg border border-border-subtle">
          {/* Left: AI Chat */}
          <ResizablePanel defaultSize={33} minSize={20} maxSize={50}>
            <div className="bg-card h-full flex flex-col">
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
                      {message.role === 'assistant' ? (
                        <TypewriterText text={message.content} className="text-sm whitespace-pre-line" />
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Live Preview */}
          <ResizablePanel defaultSize={67} minSize={50}>
            <div className="bg-card h-full flex flex-col">
              <div className="p-4 border-b border-border-subtle">
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="current" className="flex-1">Current version</TabsTrigger>
                  <TabsTrigger value="suggested" className="flex-1">Suggested version</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="space-y-4 p-4">
                      {/* Preview */}
                      <div className="relative aspect-video bg-muted/20 rounded-lg border border-border-subtle overflow-hidden">
                        <img src={currentVersion.image} alt="Campaign" className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 flex flex-col ${
                          currentVersion.buttonPosition === 'top' ? 'justify-start pt-8' :
                          currentVersion.buttonPosition === 'bottom' ? 'justify-end pb-8' :
                          'justify-center'
                        } items-center p-6 bg-gradient-to-t from-black/60 to-transparent`}>
                          <div className="text-center space-y-4 max-w-md">
                            <h3 className="text-white font-heading font-bold text-2xl">{currentVersion.title}</h3>
                            <p className="text-white/90 text-sm">{currentVersion.description}</p>
                            <Button className="bg-white text-primary hover:bg-white/90">
                              {currentVersion.buttonText}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Current metrics */}
                      <div className="p-4 bg-muted/30 rounded-lg border border-border-subtle">
                        <p className="text-xs text-muted-foreground mb-3 font-medium">Current Performance</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Click-Through Rate</p>
                            <p className="font-medium text-lg">{campaign.clickThroughRate}%</p>
                            <p className="text-xs text-muted-foreground">Target: 5.0%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Conversion Rate</p>
                            <p className="font-medium text-lg">{campaign.conversionRate}%</p>
                            <p className="text-xs text-muted-foreground">Target: 5.0%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="suggested" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="space-y-4 p-4">
                      {/* Preview - Side by side layout */}
                      <div className="bg-muted/20 rounded-lg border border-border-subtle overflow-hidden">
                        <div className="grid grid-cols-2 gap-6 p-6">
                          {/* Left: Text content */}
                          <div className="flex flex-col justify-center space-y-4">
                            <h3 className="font-heading font-bold text-2xl">{suggestedVersion.title}</h3>
                            <p className="text-muted-foreground text-sm">{suggestedVersion.description}</p>
                            <div>
                              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                                {suggestedVersion.buttonText}
                              </Button>
                            </div>
                          </div>
                          {/* Right: Image */}
                          <div className="flex items-center justify-center">
                            <img src={suggestedVersion.image} alt="Campaign" className="max-w-full h-auto object-contain" />
                          </div>
                        </div>
                      </div>

                      {/* Edit Form */}
                      <div className="space-y-4">
                        <h4 className="font-heading font-semibold text-sm">Edit Suggested Elements</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="suggested-title">Title</Label>
                            <Input
                              id="suggested-title"
                              value={suggestedVersion.title}
                              onChange={(e) => setSuggestedVersion({ ...suggestedVersion, title: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="suggested-description">Description</Label>
                            <Textarea
                              id="suggested-description"
                              value={suggestedVersion.description}
                              onChange={(e) => setSuggestedVersion({ ...suggestedVersion, description: e.target.value })}
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="suggested-button-text">Button Text</Label>
                            <Input
                              id="suggested-button-text"
                              value={suggestedVersion.buttonText}
                              onChange={(e) => setSuggestedVersion({ ...suggestedVersion, buttonText: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label htmlFor="suggested-button-position">Button Position</Label>
                            <Select 
                              value={suggestedVersion.buttonPosition} 
                              onValueChange={(value: 'top' | 'center' | 'bottom') => 
                                setSuggestedVersion({ ...suggestedVersion, buttonPosition: value })
                              }
                            >
                              <SelectTrigger id="suggested-button-position">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="bottom">Bottom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="suggested-image">Image URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="suggested-image"
                                value={suggestedVersion.image}
                                onChange={(e) => setSuggestedVersion({ ...suggestedVersion, image: e.target.value })}
                                placeholder="https://..."
                              />
                              <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 border-t border-border-subtle flex items-center justify-between gap-3">
              <Button variant="outline" size="sm">
                Version history
              </Button>
              <Button size="sm">Apply changes</Button>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </AppShell>
  );
}
