import { prisma } from '@/lib/prisma';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';

interface CommentSectionProps {
    location: string;
}
/**
 * 
 * @param location The given location to display the comments for
 * @returns The component
 */
export default async function CommentSection({location} : CommentSectionProps) {
    const entries = await (await prisma.entry.findMany({orderBy: {createdAt: "desc",}, take: 10})).filter((element)=>(element.comment != "") && (element.location == location));
    return (<>
        <Row className='border-0 py-4'>
            <Col className='mb-4'>
            <div
              className="bg-white shadow-sm h-100 d-flex flex-column justify-content-between p-4"
              style={{ borderRadius: '2rem' }}
            >
                <div className='py-2'>
                    <h2 className="fw-bold text-success">Comment Section</h2>
                    <p className="text-secondary">
                      See what other Warriors have been saying about this location.
                    </p>
                </div>
                {entries.map((entry) => (
                    <div key={entry.id} className='w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                        <div className='mb-3 flex items-center gap-1'>
                            <h5>
                                <b>{entry.submittedBy}</b>
                            </h5>
                            <p className='text-secondary'>
                                commented at {entry.createdAt.toLocaleTimeString()}
                            </p>
                            <p className='text-sm leading-relaxed py-2'>
                                {entry.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            </Col>
        </Row>
    </>
    );
}