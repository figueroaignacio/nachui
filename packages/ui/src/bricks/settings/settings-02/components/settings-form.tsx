'use client';

import { Button } from '../../../../components/button';
import { Card } from '../../../../components/card';
import { Drawer } from '../../../../components/drawer';
import { Frame } from '../../../../components/frame';
import { Label } from '../../../../components/label';
import { Select } from '../../../../components/select';
import { Switch } from '../../../../components/switch';

export function Settings02() {
  return (
    <div className="w-full">
      <Card className="mx-auto w-full max-w-3xl">
        <Card.Header>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Card.Title>Notifications</Card.Title>
              <Card.Description>Control what you get, where you get it.</Card.Description>
            </div>
            <Drawer>
              <Drawer.Trigger variant="outline" size="sm">
                Advanced
              </Drawer.Trigger>
              <Drawer.Content side="right">
                <Drawer.Header>
                  <Drawer.Title>Advanced settings</Drawer.Title>
                  <Drawer.Description>Fine tune delivery and quiet hours.</Drawer.Description>
                </Drawer.Header>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="settings-02-digest">Digest frequency</Label>
                    <Select defaultValue="weekly">
                      <Select.Trigger id="settings-02-digest" />
                      <Select.Content>
                        <Select.Item value="daily">Daily</Select.Item>
                        <Select.Item value="weekly">Weekly</Select.Item>
                        <Select.Item value="monthly">Monthly</Select.Item>
                      </Select.Content>
                    </Select>
                  </div>

                  <Frame.Panel className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Frame.Title>Quiet hours</Frame.Title>
                      <Frame.Description>Mute notifications overnight.</Frame.Description>
                    </div>
                    <Switch />
                  </Frame.Panel>

                  <div className="flex items-center justify-end gap-2">
                    <Drawer.Close>
                      <Button variant="secondary">Cancel</Button>
                    </Drawer.Close>
                    <Drawer.Close>
                      <Button>Save</Button>
                    </Drawer.Close>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            <Frame.Panel className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Frame.Title>Product updates</Frame.Title>
                <Frame.Description>New components, bricks, and releases.</Frame.Description>
              </div>
              <Switch defaultChecked />
            </Frame.Panel>

            <Frame.Panel className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Frame.Title>Security alerts</Frame.Title>
                <Frame.Description>Important account and access changes.</Frame.Description>
              </div>
              <Switch defaultChecked />
            </Frame.Panel>

            <Frame.Panel className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Frame.Title>Mentions</Frame.Title>
                <Frame.Description>When someone mentions you in a thread.</Frame.Description>
              </div>
              <Switch />
            </Frame.Panel>
          </div>
        </Card.Content>
        <Card.Footer align="end">
          <Button>Save preferences</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
