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
        <Row className='p-4'>
            <Col lg={3} className='mb-4'>
            <div
              className="bg-white shadow-sm h-100 d-flex flex-column justify-content-between p-4"
              style={{ borderRadius: '2rem' }}
            >
                {entries.map((entry) => (
                    <div key={entry.id} className='w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                        <div className='mb-3 flex items-center gap-3'>
                            <h3>
                                {entry.submittedBy}
                            </h3>
                            <p className='text-sm leading-relaxed'>
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