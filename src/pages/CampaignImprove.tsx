import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCampaigns } from '@/lib/mock-data';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VariantPreviewWithHeatmap } from '@/components/campaign/VariantPreviewWithHeatmap';
import { VariantMeta } from '@/components/campaign/VariantMeta';
import variantA from '@/assets/variant-a.png';
import variantB from '@/assets/variant-b.png';

// Mock function to generate realistic heatmap data
const generateMockHeatmapPoints = (seed: number) => {
  const points = [];
  const numClusters = 3 + Math.floor(Math.random() * 3);

  for (let cluster = 0; cluster < numClusters; cluster++) {
    const centerX = 200 + Math.random() * 800;
    const centerY = 100 + Math.random() * 400;
    const clusterSize = 15 + Math.floor(Math.random() * 20);
    const baseIntensity = 0.4 + Math.random() * 0.6;

    for (let i = 0; i < clusterSize; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const intensity = Math.max(
        0.1,
        baseIntensity - (distance / 80) * 0.3 + (Math.random() - 0.5) * 0.2
      );
      const clicks = Math.floor(50 + intensity * 200);

      points.push({
        x: Math.max(50, Math.min(1150, x)),
        y: Math.max(50, Math.min(578, y)),
        intensity: Math.min(1, intensity),
        clicks,
        element: cluster === 0 ? "CTA Button" : cluster === 1 ? "Card Image" : undefined,
      });
    }
  }

  return points;
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CampaignImprove() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock variant data
  const variantData = {
    imageUrl: variantA,
    heatmapPoints: generateMockHeatmapPoints(1),
    performance: {
      ctr: 3.2,
      conversionRate: 6.0,
      revenue: 15420.5,
      targets: {
        ctr: 8.0,
        conversionRate: 5.0,
        revenue: 25000,
      },
    },
  };

  // Initialize with proactive AI suggestions
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content: "I've analyzed your campaign performance. Here are key areas for improvement:\n\n1. **CTR is 3.2% vs target 8.0%** - Your click-through rate is significantly below target. Consider:\n   • Testing a more compelling headline\n   • Improving visual hierarchy\n   • Adding urgency indicators\n\n2. **Conversion Rate: Great job! 6.0% exceeds your 5.0% target** ✓\n\n3. **Revenue at $15,420 vs target $25,000** - Consider:\n   • Upselling strategies\n   • Bundle offers\n   • Targeting higher-value segments\n\nWhat would you like to tackle first?",
        },
      ]);
    }, 500);
  }, []);

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

            <div className="p-4 border-t border-border-subtle">
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
              <div className="space-y-6">
                <VariantPreviewWithHeatmap
                  imageUrl={variantData.imageUrl}
                  heatmapPoints={variantData.heatmapPoints}
                  imageWidth={1200}
                  imageHeight={628}
                />
                <VariantMeta
                  environment="Web"
                  campaignType="Banner"
                  startDate={campaign.startDate}
                  endDate={campaign.endDate}
                  performance={variantData.performance}
                />
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
