/**
 * Component Showcase
 * Demo page to view all UI components with UW theming
 * This is for development purposes to test components
 */

'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Modal,
  Tooltip,
  Dropdown,
  Tabs,
  LoadingSpinner,
  Alert,
  Avatar,
} from '../Components/ui';
import BiscuitIcon from '../Components/BiscuitIcon';

export default function ComponentShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen bg-uw-light p-8">
      <div className="container-uw">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-display font-bold text-gradient-uw mb-4">
            🎨 HuskyBids Component Library
          </h1>
          <p className="text-xl text-gray-600">
            Beautiful UW-themed components ready to use
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Buttons
          </h2>
          <Card>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="gold">Gold Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="success">Success Button</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="xl">Extra Large</Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" loading>Loading...</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="gold" leftIcon="🏈">With Icon</Button>
                <Button variant="purple" rightIcon="→">Next</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" hoverable>
              <h3 className="text-xl font-bold text-uw-purple mb-2">Default Card</h3>
              <p className="text-gray-600">This is a default card with hover effect</p>
            </Card>
            
            <Card variant="elevated">
              <h3 className="text-xl font-bold text-uw-purple mb-2">Elevated Card</h3>
              <p className="text-gray-600">This card has a larger shadow</p>
            </Card>
            
            <Card variant="gold">
              <h3 className="text-xl font-bold text-uw-purple mb-2">Gold Card</h3>
              <p className="text-gray-600">Gold border for special content</p>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Badges
          </h2>
          <Card>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="purple">Purple</Badge>
              <Badge variant="gold">Gold</Badge>
              <Badge variant="purple-solid">Purple Solid</Badge>
              <Badge variant="gold-solid">Gold Solid</Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Alerts
          </h2>
          <div className="space-y-4">
            <Alert variant="success" title="Success!" dismissible>
              Your bet has been placed successfully!
            </Alert>
            
            <Alert variant="error" title="Error">
              Insufficient biscuits. Please add more to your account.
            </Alert>
            
            <Alert variant="warning" title="Warning">
              Game starts in 10 minutes. Place your bets now!
            </Alert>
            
            <Alert variant="info" title="Info">
              New features are available. Check them out!
            </Alert>
            
            <Alert variant="purple" title="Go Huskies!">
              UW is playing today at 3:30 PM!
            </Alert>
          </div>
        </section>

        {/* Forms Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Form Elements
          </h2>
          <Card>
            <div className="space-y-6">
              <Input
                label="Username"
                placeholder="Enter your username"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Choose a unique username"
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="your.email@uw.edu"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
              
              <Input
                label="Bet Amount"
                type="number"
                placeholder="100"
                error="Must be at least 10 biscuits"
              />
              
              <Textarea
                label="Comment"
                placeholder="Add a comment about your bet..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                rows={4}
                maxLength={200}
                showCount
                helperText="Optional message for other users"
              />
            </div>
          </Card>
        </section>

        {/* Avatars Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Avatars
          </h2>
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar name="John Doe" size="xs" />
                <Avatar name="Jane Smith" size="sm" status="online" />
                <Avatar name="Bob Johnson" size="md" status="away" />
                <Avatar name="Alice Williams" size="lg" />
                <Avatar name="Charlie Brown" size="xl" status="online" />
                <Avatar name="Diana Prince" size="2xl" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Avatar Group:</p>
                <Avatar.Group max={4} size="md">
                  <Avatar name="User 1" />
                  <Avatar name="User 2" />
                  <Avatar name="User 3" />
                  <Avatar name="User 4" />
                  <Avatar name="User 5" />
                  <Avatar name="User 6" />
                </Avatar.Group>
              </div>
            </div>
          </Card>
        </section>

        {/* Biscuit Icons Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Biscuit Icons
          </h2>
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <BiscuitIcon size={24} />
                <BiscuitIcon size={32} />
                <BiscuitIcon size={48} />
                <BiscuitIcon size={64} animate />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Balance Display:</p>
                <BiscuitIcon.Balance amount={1250} />
              </div>
            </div>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Modal
          </h2>
          <Card>
            <Button variant="gold" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Place Your Bet"
              size="md"
              footer={
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="gold" onClick={() => setIsModalOpen(false)}>
                    Confirm Bet
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-600">
                  You are about to place a bet on UW vs Oregon. Are you sure?
                </p>
                <Alert variant="info">
                  Your bet will be locked once the game starts.
                </Alert>
              </div>
            </Modal>
          </Card>
        </section>

        {/* Tooltip Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Tooltips
          </h2>
          <Card>
            <div className="flex gap-4">
              <Tooltip content="This is a top tooltip" position="top">
                <Button variant="secondary">Hover Me (Top)</Button>
              </Tooltip>
              
              <Tooltip content="This is a bottom tooltip" position="bottom">
                <Button variant="secondary">Hover Me (Bottom)</Button>
              </Tooltip>
              
              <Tooltip content="This is a left tooltip" position="left">
                <Button variant="secondary">Hover Me (Left)</Button>
              </Tooltip>
              
              <Tooltip content="This is a right tooltip" position="right">
                <Button variant="secondary">Hover Me (Right)</Button>
              </Tooltip>
            </div>
          </Card>
        </section>

        {/* Dropdown Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Dropdown
          </h2>
          <Card>
            <Dropdown
              trigger={
                <Button variant="secondary">
                  Open Menu ▼
                </Button>
              }
              position="bottom-left"
            >
              <Dropdown.Item icon="👤">View Profile</Dropdown.Item>
              <Dropdown.Item icon="⚙️">Settings</Dropdown.Item>
              <Dropdown.Item icon="📊">Statistics</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon="🚪" danger>Logout</Dropdown.Item>
            </Dropdown>
          </Card>
        </section>

        {/* Tabs Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Tabs
          </h2>
          <Card padding="none">
            <div className="p-6">
              <Tabs
                variant="underline"
                tabs={[
                  {
                    label: 'Overview',
                    icon: '📊',
                    content: (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Overview Content</h3>
                        <p className="text-gray-600">This is the overview tab content.</p>
                      </div>
                    ),
                  },
                  {
                    label: 'Statistics',
                    icon: '📈',
                    content: (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Statistics Content</h3>
                        <p className="text-gray-600">Your betting statistics will appear here.</p>
                      </div>
                    ),
                  },
                  {
                    label: 'Settings',
                    icon: '⚙️',
                    content: (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">Settings Content</h3>
                        <p className="text-gray-600">Configure your preferences here.</p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* Loading Spinners Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-uw-purple mb-6 page-header">
            Loading Spinners
          </h2>
          <Card>
            <div className="flex flex-wrap items-center gap-8">
              <div className="text-center">
                <LoadingSpinner size="sm" color="purple" />
                <p className="text-xs text-gray-600 mt-2">Small</p>
              </div>
              
              <div className="text-center">
                <LoadingSpinner size="md" color="purple" />
                <p className="text-xs text-gray-600 mt-2">Medium</p>
              </div>
              
              <div className="text-center">
                <LoadingSpinner size="lg" color="gold" />
                <p className="text-xs text-gray-600 mt-2">Large</p>
              </div>
              
              <div className="text-center">
                <LoadingSpinner size="xl" color="purple" text="Loading..." />
              </div>
              
              <div className="text-center">
                <LoadingSpinner.UWSpinner size="md" />
                <p className="text-xs text-gray-600 mt-2">UW Branded</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Success Message */}
        <div className="text-center py-12 bg-gradient-uw rounded-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">🎉 Phase 1 Complete!</h2>
          <p className="text-xl mb-6">
            Design system and component library are ready to use
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="gold" size="lg">
              Start Building
            </Button>
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
